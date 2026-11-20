import { SendMessageOutputBoundary } from "@/usecase/messages/chat-page/send-message/SendMessageOuputBoundary";
import { SendMessageOutputData } from "@/usecase/messages/chat-page/send-message/SendMessageOutputData";
import { LoadingChatPageViewModel } from "../LoadingChatPageViewModel";

export class SendMessagePresenter implements SendMessageOutputBoundary {
  viewModel: LoadingChatPageViewModel;

  constructor(viewModel: LoadingChatPageViewModel) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView(
    outputData: SendMessageOutputData,
  ): Promise<void> {
    for (const message of outputData.messages) {
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
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): Promise<void> {
    throw new Error(error);
  }
}
