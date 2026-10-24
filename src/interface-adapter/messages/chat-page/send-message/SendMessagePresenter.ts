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
    this.viewModel.messages = outputData.messages;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): Promise<void> {
    throw new Error(error);
  }
}
