import { Chat } from "@/entity/Chat";
import { ViewModel } from "../ViewModel";
import { LoadingMessagesPageState } from "./loading-messages-page/LoadingMessagesPageState";
import { NewChatState } from "./new-chat/NewChatState";
import { ScrollChatsState } from "./scroll-chats/ScrollChatsState";

export class LoadingMessagesPageViewModel extends ViewModel {
  state: LoadingMessagesPageState | NewChatState | ScrollChatsState =
    LoadingMessagesPageState.LOADING;
  chats: Chat[] = [];
  user_id: string = "";

  constructor() {
    super();
  }

  loadMainPageView(chats: Chat[]) {
    for (const chat of chats) {
      let exists = false;
      for (const chatViewModel of this.chats) {
        if (chat.id === chatViewModel.id) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        this.chats.push(chat);
      }
    }
    super.firePropertyChange();
  }
}
