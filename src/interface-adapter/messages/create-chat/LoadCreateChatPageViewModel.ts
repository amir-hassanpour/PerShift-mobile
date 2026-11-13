import { Chat } from "@/entity/Chat";
import { User } from "@/entity/User";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { LoadCreateChatPageState } from "./load-create-chat-page/LoadCreateChatPageState";

export class LoadCreateChatPageViewModel extends ViewModel {
  businessID: string = "";

  chatUsers: Array<Chat | User> = [];

  state: LoadCreateChatPageState =
    LoadCreateChatPageState.IDLE_LOADING_CREATE_CHAT;
}
