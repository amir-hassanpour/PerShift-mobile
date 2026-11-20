import { Message } from "@/entity/Message";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { LoadingChatPageState } from "./load-chat-page/LoadingChatPageState";
import { ScrollMessagesState } from "./scroll-messages/ScrollMessagesState";

export class LoadingChatPageViewModel extends ViewModel {
  state: LoadingChatPageState | ScrollMessagesState = LoadingChatPageState.IDLE;
  messages: Message[] = [];

  async laodChatPage(messages: Message[]): Promise<void> {
    for (const message of messages) {
      let exists = false;
      for (const messageViewModel of this.messages) {
        if (message.id === messageViewModel.id) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        this.messages.push(message);
      }
      this.messages.sort((a, b) => a.time.getTime() - b.time.getTime());
    }
    await super.firePropertyChange();
  }
}
