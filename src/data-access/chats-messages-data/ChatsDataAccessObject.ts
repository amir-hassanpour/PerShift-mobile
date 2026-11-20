import { Chat } from "@/entity/Chat";
import { Message } from "@/entity/Message";
import { User } from "@/entity/User";
import {
  LoadingChatPageDataAccessInterface,
  loadingChatPageOutput,
} from "@/usecase/messages/chat-page/load-chat-page/LoadingChatPageDataAccessInterface";
import {
  NewMessageDataAccessInterface,
  NewMessageInput,
  NewMessageOutput,
} from "@/usecase/messages/chat-page/new-message/NewMessageDataAccessInterface";
import {
  ScrollMessagesDAI,
  ScrollMessagesInput,
  ScrollMessagesOutput,
} from "@/usecase/messages/chat-page/scroll-messages/ScrollMessagesDAI";
import {
  OutputData,
  SendMessageDataAccessInterface,
} from "@/usecase/messages/chat-page/send-message/SendMessageDataAccessInterface";
import {
  ChatExistsDAI,
  ChatExistsInput,
  ChatExistsOutput,
} from "@/usecase/messages/create-chat/chat_exists/ChatExistsDAI";
import {
  CreateChatDAI,
  CreateChatInput,
  CreateChatOutput,
} from "@/usecase/messages/create-chat/create-chat/CreateChatDAI";
import {
  LoadCreateChatInput,
  LoadCreateChatOutput,
  LoadCreateChatPageDAI,
} from "@/usecase/messages/create-chat/load-create-chat-page/LoadCreateChatPageDAI";
import {
  LoadCreateGroupchatPageDAI,
  LoadCreateGroupchatPageInput,
  LoadCreateGroupchatPageOutput,
} from "@/usecase/messages/create-chat/load-create-groupchat-page/LoadCreateGroupchatPageDAI";
import {
  ChatsOutput,
  LoadingMessagesPageDataAccessInterface,
} from "@/usecase/messages/loading-messages-page/LoadingMessagesPageDataAccessInterface";
import {
  NewChatDataAccessInterface,
  NewChatInput,
  NewChatOutput,
} from "@/usecase/messages/new-chat/NewChatDataAccessInterface";
import {
  ScrollChatsDAI,
  ScrollChatsInput,
  ScrollChatsOutput,
} from "@/usecase/messages/scroll-chats/ScrollChatsDAI";
import { BusinessRAMDisk } from "../business-shifts-data/BusinessRAMDisk";
import { MemberRAMDisk } from "../members/MemberRAMDisk";
import { supabase } from "../supabase/client";
import { UserRAMDisk } from "../user-data/UserRAMDisk";
import { ChatsRAMDisk } from "./ChatsRAMDisk";
import { MessagesRAMDisk } from "./MessageRAMDisk";

export class ChatsDataAccessObject
  implements
    LoadingMessagesPageDataAccessInterface,
    LoadingChatPageDataAccessInterface,
    NewChatDataAccessInterface,
    NewMessageDataAccessInterface,
    SendMessageDataAccessInterface,
    LoadCreateChatPageDAI,
    ChatExistsDAI,
    CreateChatDAI,
    LoadCreateGroupchatPageDAI,
    ScrollMessagesDAI,
    ScrollChatsDAI
{
  async scrollChats(input: ScrollChatsInput): Promise<ScrollChatsOutput> {
    if (!Number.isSafeInteger(input.numChats) || input.numChats < 0) {
      throw new Error("Page number must be a non-negative integer");
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!business) {
      throw new Error("No business is currently selected");
    }

    const pageSize = 5;
    const from = input.numChats * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("chat")
      .select(
        `
      id,
      business_id,
      chat_name,
      self,
      last_message_at,
      membership:chat_assignment!inner(
        profile_id,
        still_assigned
      )
    `,
      )
      .eq("business_id", business.id)
      .eq("membership.profile_id", user.id)
      .eq("membership.still_assigned", true)
      .order("last_message_at", {
        ascending: false,
        nullsFirst: false,
      })
      .order("id", { ascending: true })
      .range(from, to);

    if (error) throw error;
    if (!data) throw new Error("Could not retrieve chats");

    const chats: Chat[] = [];

    for (const row of data) {
      let participantsQuery = supabase
        .from("chat_assignment")
        .select("first_name, last_name")
        .eq("chat_id", row.id);

      if (row.self) {
        participantsQuery = participantsQuery.eq("profile_id", user.id);
      } else {
        participantsQuery = participantsQuery.neq("profile_id", user.id);
      }

      const { data: participants, error: participantsError } =
        await participantsQuery
          .order("profile_id", { ascending: true })
          .limit(3);

      if (participantsError) throw participantsError;

      const name =
        (participants ?? [])
          .map((person) =>
            [person.first_name, person.last_name].filter(Boolean).join(" "),
          )
          .filter(Boolean)
          .join(", ") ||
        row.chat_name ||
        "Unnamed chat";

      const {
        data: messages,
        error: messagesError,
        count,
      } = await supabase
        .from("message")
        .select("content", { count: "exact" })
        .eq("chat_id", row.id)
        .order("time", { ascending: false })
        .order("id", { ascending: true })
        .limit(1);

      if (messagesError) throw messagesError;

      const lastTextedAt =
        row.last_message_at == null ? undefined : new Date(row.last_message_at);

      if (
        lastTextedAt !== undefined &&
        !Number.isFinite(lastTextedAt.getTime())
      ) {
        throw new Error(`Chat ${row.id} contains an invalid date`);
      }

      chats.push(
        new Chat(
          row.id,
          row.business_id,
          name,
          lastTextedAt,
          count ?? 0,
          messages?.[0]?.content ?? "",
        ),
      );
    }

    return { chats };
  }

  async scrollMessages(
    input: ScrollMessagesInput,
  ): Promise<ScrollMessagesOutput> {
    if (!Number.isSafeInteger(input.numMessages) || input.numMessages < 0) {
      throw new Error("Page number must be a non-negative integer");
    }

    const pageSize = 10;
    const from = input.numMessages * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("message")
      .select("id, chat_id, content, time, sender_id")
      .eq("chat_id", input.chatID)
      .order("time", { ascending: false })
      .order("id", { ascending: true })
      .range(from, to);

    if (error) throw error;
    if (!data) throw new Error("Could not retrieve messages");

    const messages = data.map((row) => {
      const time = new Date(row.time);

      if (!Number.isFinite(time.getTime())) {
        throw new Error(`Message ${row.id} contains an invalid date`);
      }

      return new Message(row.id, row.chat_id, row.content, time, row.sender_id);
    });

    messages.sort(
      (a, b) => a.time.getTime() - b.time.getTime() || a.id.localeCompare(b.id),
    );

    return { messages };
  }

  async loadCreateGroupchatPage(
    input: LoadCreateGroupchatPageInput,
  ): Promise<LoadCreateGroupchatPageOutput> {
    const user = await new UserRAMDisk().getCurrentUser();

    if (!user) {
      throw new Error("Current user is not available in the local cache");
    }

    const members = await new MemberRAMDisk().getMembers();

    return {
      users: members
        .filter((member) => member.id !== user.id && member.id !== user.id)
        .map((member) => member),
      businessID:
        (await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness())?.id ??
        "",
    };
  }

  async createChat(input: CreateChatInput): Promise<CreateChatOutput> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    let selfChat = false;

    if (input.users.length === 1) {
      selfChat = input.users[0].id === user.id;
    }

    const { error } = await supabase.from("chat").insert({
      id: input.chat.id,
      chat_name: input.chat.name,
      business_id: input.chat.business_id,
      admin: user.id,
      dm: !input.isGroupChat,
      self: selfChat,
    });

    if (error) {
      console.log(error);
      throw error;
    }

    const users = new Set(
      input.users
        .filter((member) => member.id !== user.id)
        .map((member) => member),
    );

    for (const userToAdd of users) {
      const { error: error2 } = await supabase.from("chat_assignment").insert({
        chat_id: input.chat.id,
        profile_id: userToAdd.id,
        business_id: input.chat.business_id,
      });

      if (error2) {
        console.error(
          "[Recipient assignment]",
          JSON.stringify(error2, null, 2),
        );
        throw error2;
      }
    }

    const chat = [];

    for (const user of input.users) {
      chat.push(user.firstName + " " + user.lastName);
    }

    let chatName = chat.join(", ");

    if (chatName === "") {
      const userFirstName = await new UserRAMDisk().getCurrentUser();

      if (userFirstName) chatName = userFirstName.firstName;
      else chatName = "No Name";
    }

    const newChat = new Chat(input.chat.id, input.chat.business_id, chatName);

    await new ChatsRAMDisk().saveChat(newChat);

    const userToAddChats = await this.loadCreateChatPage({});

    return {
      chats: [...userToAddChats.chats, ...userToAddChats.users],
    };
  }

  async messagesNotViewedNumber(chatID: string): Promise<number> {
    // NOT IMPLEMENTED YET
    return 0;
  }

  async userAssignedToChat(chatID: string): Promise<string> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const { data: participants, error } = await supabase
      .from("chat_assignment")
      .select("first_name, last_name")
      .eq("chat_id", chatID)
      .neq("profile_id", user.id)
      .order("profile_id", { ascending: true })
      .limit(3);

    if (error) throw error;

    return (participants ?? [])
      .map((person) =>
        [person.first_name, person.last_name].filter(Boolean).join(" "),
      )
      .filter(Boolean)
      .join(", ");
  }

  async chatEsists(input: ChatExistsInput): Promise<ChatExistsOutput> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    if (input.user.id === user.id) {
      return { chat: await this.userSelfChat() };
    }

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (business === null) {
      throw new Error("Couldn't retrieve most recent buisness checked in");
    }

    const { data, error } = await supabase
      .from("chat_assignment")
      .select("chat_id, profile_id, business_id")
      .eq("profile_id", user.id)
      .eq("business_id", business.id)
      .eq("still_assigned", true);

    if (error) throw error;
    if (!data) return { chat: null };

    for (const chat of data) {
      const { data: data2, error: error2 } = await supabase
        .from("chat")
        .select(
          `
          id,
          chat_name,
          business_id,
          admin,
          last_message_at,
          dm,
          assigned:chat_assignment!inner(
            profile_id,
            chat_id,
            business_id,
            still_assigned
          )
        `,
        )
        .eq("id", chat.chat_id)
        .eq("assigned.profile_id", input.user.id)
        .eq("assigned.still_assigned", true)
        .eq("dm", true)
        .limit(1);

      if (error2) throw error2;

      if (data2 && data2.length > 0) {
        return {
          chat: new Chat(
            data2[0].id,
            data2[0].business_id,
            data2[0].chat_name,
            data2[0].last_message_at,
            await this.messagesNotViewedNumber(data2[0].id),
            "",
          ),
        };
      }
    }

    return { chat: null };
  }

  async userSelfChat() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!business) {
      throw new Error("Couldn't retrieve most recent buisness checked in");
    }

    const { data: userSelfChat, error: errors } = await supabase
      .from("chat")
      .select(
        `
        self,
        id,
        chat_name,
        business_id,
        admin,
        last_message_at,
        dm,
        chat_a:chat_assignment!inner(
          profile_id,
          chat_id,
          still_assigned
        )
      `,
      )
      .eq("self", true)
      .eq("business_id", business.id)
      .eq("chat_a.profile_id", user.id)
      .eq("chat_a.still_assigned", true);

    if (errors) throw errors;

    if (!userSelfChat) {
      throw new Error(
        "Coudldn't access the users self chats in chat_assignment",
      );
    }

    if (userSelfChat.length === 0) return null;

    return new Chat(
      userSelfChat[0].id,
      userSelfChat[0].business_id,
      userSelfChat[0].chat_name,
      userSelfChat[0].last_message_at,
      await this.messagesNotViewedNumber(userSelfChat[0].id),
      "",
    );
  }

  async loadCreateChatPage(
    input: LoadCreateChatInput,
  ): Promise<LoadCreateChatOutput> {
    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!business) {
      throw new Error("no current business was found as the last checked in");
    }

    const chats = await new ChatsRAMDisk().getChats();
    const members = await new MemberRAMDisk().getMembers();

    const membersID = new Map<string, User>(
      members.map((member) => [member.id, member]),
    );

    for (const chat of chats) {
      const { data: assignment, error: errorA } = await supabase
        .from("chat_assignment")
        .select(
          `
          profile_id,
          chat_id,
          chat:chat!inner(dm)
        `,
        )
        .eq("chat_id", chat.id)
        .eq("still_assigned", true)
        .eq("chat.dm", true);

      if (errorA) throw errorA;
      if (!assignment) throw new Error("chat assignment not found");

      for (const user of assignment) {
        if (membersID.has(user.profile_id)) {
          membersID.delete(user.profile_id);
        }
      }
    }

    const userToAdd: User[] = [];

    for (const user of membersID) {
      userToAdd.push(user[1]);
    }

    const curUser = await new UserRAMDisk().getCurrentUser();

    if (
      (await this.userSelfChat()) === null &&
      curUser &&
      !membersID.has(curUser.id)
    ) {
      userToAdd.push(curUser);
    }

    return {
      chats,
      users: userToAdd,
      businessID: business.id,
    };
  }

  async sendMessage(inputData: Message): Promise<OutputData> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) {
      throw new Error("what the fuck");
    }

    const { error } = await supabase.from("message").insert({
      id: inputData.id,
      chat_id: inputData.chat_id,
      content: inputData.content,
      time: inputData.time,
      sender_id: user.id,
    });

    if (error) {
      console.error("Test insert failed:", error);
      throw error;
    }

    await new MessagesRAMDisk().saveMessage(inputData);

    const messagesOutput = await new MessagesRAMDisk().getMessages(
      inputData.chat_id,
    );

    return { messages: messagesOutput };
  }

  async newChat(newChatInput: NewChatInput): Promise<NewChatOutput> {
    let chatName = await this.userAssignedToChat(newChatInput.chat_id);

    if (newChatInput.self) {
      const curUser = await new UserRAMDisk().getCurrentUser();

      if (curUser) {
        chatName = curUser.firstName + " " + curUser.lastName;
      }
    }

    if (chatName === "") chatName = "No Name";

    await new ChatsRAMDisk().saveChat(
      new Chat(newChatInput.chat_id, newChatInput.business_id, chatName),
    );

    return { chats: await new ChatsRAMDisk().getChats() };
  }

  async newMessage(message: NewMessageInput): Promise<NewMessageOutput> {
    await new MessagesRAMDisk().saveMessage(message);

    const messages = await new MessagesRAMDisk().getMessages(message.chat_id);

    return { messages };
  }

  async getChatByID(chatID: string): Promise<Chat | undefined> {
    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!business) throw new Error("No business is currently selected");

    const { data, error } = await supabase
      .from("chat")
      .select("id, business_id, chat_name, self, last_message_at")
      .eq("id", chatID)
      .eq("business_id", business.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;

    let name = await this.userAssignedToChat(chatID);

    if (data.self) {
      const user = await new UserRAMDisk().getCurrentUser();

      if (user) {
        name = `${user.firstName} ${user.lastName}`;
      }
    }

    const { data: messageRetrieve, error: messageRetrieveError } =
      await supabase
        .from("message")
        .select("id, chat_id, content, time, sender_id")
        .eq("chat_id", data.id)
        .order("time", { ascending: false })
        .order("id", { ascending: true })
        .limit(10);

    if (messageRetrieveError) throw messageRetrieveError;
    if (!messageRetrieve) throw new Error("Failed to retrieve chats messages");

    const messagesChat: Message[] = messageRetrieve.map(
      (message) =>
        new Message(
          message.id,
          message.chat_id,
          message.content,
          new Date(message.time),
          message.sender_id,
        ),
    );

    for (const messageSave of messagesChat)
      await new MessagesRAMDisk().saveMessage(messageSave);

    return new Chat(
      data.id,
      data.business_id,
      name || data.chat_name || "Unnamed chat",
      data.last_message_at == null ? undefined : new Date(data.last_message_at),
      0,
      "",
    );
  }

  async loadingChatPage({
    chat_id,
  }: {
    chat_id: string;
  }): Promise<loadingChatPageOutput> {
    return {
      messages: await new MessagesRAMDisk().getMessages(chat_id),
    };
  }

  async loadMainPage(): Promise<ChatsOutput> {
    const chatRD = new ChatsRAMDisk();
    const allChats = await chatRD.getChats();
    const curUser = new UserRAMDisk();
    const curUserID = (await curUser.getCurrentUser())?.id;

    if (curUserID === undefined) {
      throw new Error("Current user is not available in the local cache");
    }

    return { chats: allChats, user_id: curUserID };
  }
}
