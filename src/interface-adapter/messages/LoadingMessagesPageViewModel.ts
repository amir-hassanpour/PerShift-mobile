import { Chat } from "@/entity/Chat";
import { ViewModel } from "../ViewModel";
import { LoadingMessagesPageState } from "./loading-messages-page/LoadingMessagesPageState";
import { NewChatState } from "./new-chat/NewChatState";

export class LoadingMessagesPageViewModel extends ViewModel {
  state: LoadingMessagesPageState | NewChatState =
    LoadingMessagesPageState.LOADING;
  chats: Chat[] = [];
  user_id: string = "";

  constructor() {
    super();
  }

  loadMainPageView(chats: Chat[]) {
    this.chats = chats;
    this.user_id = this.user_id;
    super.firePropertyChange();
  }
}
