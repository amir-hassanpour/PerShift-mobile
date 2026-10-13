import { Chat } from "@/entity/Chat";
import { ViewModel } from "../ViewModel";
import { LoadingMessagesPageState } from "./loading-messages-page/LoadingMessagesPageState";
import { NewChatState } from "./new-chat/NewChatState";

export class LoadingMessagesPageViewModel extends ViewModel {
  state: LoadingMessagesPageState | NewChatState =
    LoadingMessagesPageState.LOADING;
  chats: Chat[] = [];

  constructor() {
    super();
  }

  loadMainPageView(chats: Chat[]) {
    this.chats = chats;
    super.firePropertyChange();
  }
}
