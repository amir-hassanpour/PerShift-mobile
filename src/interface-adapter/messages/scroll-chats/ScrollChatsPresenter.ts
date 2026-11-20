import { ScrollChatsOutputBoundary } from "@/usecase/messages/scroll-chats/ScrollChatsOutputBoundary";
import { ScrollChatsOutputData } from "@/usecase/messages/scroll-chats/ScrollChatsOutputData";
import { LoadingMessagesPageViewModel } from "../LoadingMessagesPageViewModel";
import { ScrollChatsState } from "./ScrollChatsState";

export class ScrollChatsPresenter implements ScrollChatsOutputBoundary {
  viewModel: LoadingMessagesPageViewModel;

  constructor(viewModel: LoadingMessagesPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(output: ScrollChatsOutputData): void {
    for (const chat of output.chats) {
      let exists = false;
      for (const chatViewModel of this.viewModel.chats) {
        if (chat.id === chatViewModel.id) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        this.viewModel.chats.push(chat);
      }
    }
    this.viewModel.state = ScrollChatsState.SUCCESS_SCROLL_CHATS;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = ScrollChatsState.FAILED_SCROLL_CHATS;
    this.viewModel.firePropertyChange();
  }
}
