import {
    ChatsOutput,
    LoadingMessagesPageDataAccessInterface,
} from "@/usecase/loading-messages-page/LoadingMessagesPageDataAccessInterface";
import { ChatsRAMDisk } from "./ChatsRAMDisk";

export class ChatsDataAccessObject implements LoadingMessagesPageDataAccessInterface {
  async loadMainPage(): Promise<ChatsOutput> {
    const chatRD = new ChatsRAMDisk();
    const allChats = await chatRD.getChats();

    return { chats: allChats };
  }
}
