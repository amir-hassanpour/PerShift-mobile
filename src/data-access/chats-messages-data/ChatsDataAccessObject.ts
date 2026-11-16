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
    LoadCreateGroupchatPageDAI
{
  async loadCreateGroupchatPage(
    input: LoadCreateGroupchatPageInput,
  ): Promise<LoadCreateGroupchatPageOutput> {
    const user = await new UserRAMDisk().getCurrentUser();
    if (!user)
      throw new Error("Current user is not available in the local cache");

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
    if (input.users.length === 1) selfChat = input.users[0].id === user.id;

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

    return { chats: [...userToAddChats.chats, ...userToAddChats.users] };
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

    const { data: chatAssignment, error: error2 } = await supabase
      .from("chat_assignment")
      .select("profile_id")
      .eq("chat_id", chatID)
      .neq("profile_id", user.id)
      .limit(3);
    if (error2) throw error2;
    if (!chatAssignment) throw new Error("chat not found");
    const names = [];
    for (const ids of chatAssignment) {
      const { data: profile, error: error3 } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("profile_id", ids.profile_id)
        .limit(1);

      if (error3) throw error3;
      if (!profile)
        throw new Error("couldn't retrieve profile to construct chat name");
      names.push(profile[0].first_name + " " + profile[0].last_name);
    }
    return names.join(", ");
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

    if (business === null)
      throw new Error("Couldn't retrieve most recent buisness checked in");

    const { data, error } = await supabase
      .from("chat_assignment")
      .select("chat_id, profile_id, business_id")
      .eq("profile_id", user.id)
      .eq("business_id", business.id);

    if (error) throw error;
    if (!data) return { chat: null };

    for (const chat of data) {
      const { data: data2, error: error2 } = await supabase
        .from("chat")
        .select(
          `id,
          chat_name,
          business_id,
          admin, 
          last_message_at,
          dm,
        assigned:chat_assignment!inner(
        profile_id, chat_id, business_id)`,
        )
        .eq("id", chat.chat_id)
        .eq("assigned.profile_id", input.user.id)
        .eq("dm", true)
        .limit(1);

      if (error2) throw error2;
      if (data2)
        if (data2.length > 0) {
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

    const { data: userSelfChat, error: errors } = await supabase
      .from("chat")
      .select(
        `self, id, chat_name, business_id, admin, last_message_at, dm, chat_a:chat_assignment!inner(profile_id, chat_id)`,
      )
      .eq("self", true)
      .eq("chat_a.profile_id", user.id);

    if (errors) throw errors;
    if (!userSelfChat)
      throw new Error(
        "Coudldn't access the users self chats in chat_assignment",
      );

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

    if (!business)
      throw new Error("no current business was found as the last checked in");

    const chats = await new ChatsRAMDisk().getChats();
    const members = await new MemberRAMDisk().getMembers();

    const membersID = new Map<string, User>(
      members.map((member) => [member.id, member]),
    );

    for (const chat of chats) {
      const { data: assignment, error: errorA } = await supabase
        .from("chat_assignment")
        .select("profile_id, chat_id")
        .eq("chat_id", chat.id);

      if (errorA) throw errorA;
      if (!assignment) throw new Error("chat assignment not found");

      for (const user of assignment) {
        if (membersID.has(user.profile_id)) membersID.delete(user.profile_id);
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
    )
      userToAdd.push(curUser);

    return {
      chats: chats,
      users: userToAdd,
      businessID: business.id,
    };
  }

  async sendMessage(inputData: Message): Promise<OutputData> {
    new MessagesRAMDisk().saveMessage(inputData);

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

    if (error) console.error("Test insert failed:", error);

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
    return {
      messages: messages,
    };
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
