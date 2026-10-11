import { Chat } from "@/entity/Chat";
import { ViewModel } from "../ViewModel";
import { LoadingMessagesPageState } from "./loading-messages-page/LoadingMessagesPageState";

export class LoadingMessagesPageViewModel extends ViewModel {
  state: LoadingMessagesPageState = LoadingMessagesPageState.LOADING;
  chats: Chat[] = [];

  constructor() {
    super();
  }

  loadMainPageView(chats: Chat[]) {
    this.chats = chats;
  }
}
