import { Message } from "@/entity/Message";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { LoadingChatPageState } from "./load-chat-page/LoadingChatPageState";

export class LoadingChatPageViewModel extends ViewModel {
  state: LoadingChatPageState = LoadingChatPageState.IDLE;
  messages: Message[] = [];

  async laodChatPage(messages: Message[]): Promise<void> {
    this.messages = messages;
    super.firePropertyChange();
  }
}
