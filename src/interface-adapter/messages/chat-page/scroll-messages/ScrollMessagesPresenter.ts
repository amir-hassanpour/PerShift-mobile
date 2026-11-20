import { ScrollMessagesOutputBoundary } from "@/usecase/messages/chat-page/scroll-messages/ScrollMessagesOutputBoundary";
import { ScrollMessagesOutputData } from "@/usecase/messages/chat-page/scroll-messages/ScrollMessagesOutputData";
import { LoadingChatPageViewModel } from "../LoadingChatPageViewModel";
import { ScrollMessagesState } from "./ScrollMessagesState";

export class ScrollMessagesPresenter implements ScrollMessagesOutputBoundary {
  viewModel: LoadingChatPageViewModel;

  constructor(viewModel: LoadingChatPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(output: ScrollMessagesOutputData): void {
    for (const message of output.messages) {
      let exists = false;
      for (const messageViewModel of this.viewModel.messages) {
        if (message.id === messageViewModel.id) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        this.viewModel.messages.push(message);
      }
      this.viewModel.messages.sort(
        (a, b) => a.time.getTime() - b.time.getTime(),
      );
    }
    this.viewModel.state = ScrollMessagesState.SUCCESS_SCROLL_MESSAGES;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = ScrollMessagesState.FAILED_SCROLL_MESSAGES;
    this.viewModel.firePropertyChange();
  }
}
