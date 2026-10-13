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
  ChatsOutput,
  LoadingMessagesPageDataAccessInterface,
} from "@/usecase/messages/loading-messages-page/LoadingMessagesPageDataAccessInterface";
import {
  NewChatDataAccessInterface,
  NewChatInput,
  NewChatOutput,
} from "@/usecase/messages/new-chat/NewChatDataAccessInterface";
import { ChatsRAMDisk } from "./ChatsRAMDisk";

export class ChatsDataAccessObject
  implements
    LoadingMessagesPageDataAccessInterface,
    LoadingChatPageDataAccessInterface,
    NewChatDataAccessInterface,
    NewMessageDataAccessInterface
{
  newChat(newChatInput: NewChatInput): Promise<NewChatOutput> {
    throw new Error("Method not implemented.");
  }

  newMessage(message: NewMessageInput): Promise<NewMessageOutput> {
    throw new Error("Method not implemented.");
  }

  loadingChatPage(): Promise<loadingChatPageOutput> {
    throw new Error("Method not implemented.");
  }

  async loadMainPage(): Promise<ChatsOutput> {
    const chatRD = new ChatsRAMDisk();
    const allChats = await chatRD.getChats();

    return { chats: allChats };
  }
}
