import { Chat } from "@/entity/Chat";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { CreateChatState } from "./CreateChatState";

export class CreateChatViewModel extends ViewModel {
  state: CreateChatState = CreateChatState.SUCCESS_CREATE_CHAT;
  chat: Chat | null = null;
}
