import { Message } from "@/entity/Message";
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
  ChatsOutput,
  LoadingMessagesPageDataAccessInterface,
} from "@/usecase/messages/loading-messages-page/LoadingMessagesPageDataAccessInterface";
import {
  NewChatDataAccessInterface,
  NewChatInput,
  NewChatOutput,
} from "@/usecase/messages/new-chat/NewChatDataAccessInterface";
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
    SendMessageDataAccessInterface
{
  async sendMessage(inputData: Message): Promise<OutputData> {
    new MessagesRAMDisk().saveMessage(inputData);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

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
    await new ChatsRAMDisk().saveChat({
      id: newChatInput.chat_id,
      business_id: newChatInput.business_id,
      lastText: "No Messages Yet",
      name: "No Name",
      lastTextedAt: undefined,
      messageCount: 0,
    });

    return { chats: await new ChatsRAMDisk().getChats() };
  }

  async newMessage(message: NewMessageInput): Promise<NewMessageOutput> {
    await new MessagesRAMDisk().saveMessage(message);

    return {
      messages: await new MessagesRAMDisk().getMessages(message.chat_id),
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
