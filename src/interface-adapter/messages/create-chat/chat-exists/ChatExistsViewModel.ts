import { Chat } from "@/entity/Chat";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { ChatExistsState } from "./ChatExistsState";

export class ChatExistsViewModel extends ViewModel {
  state: ChatExistsState = ChatExistsState.IDLE_CHAT_EXISTS;
  chat: Chat | null = null;
}
