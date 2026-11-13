import { NewMessageOutputBoundary } from "@/usecase/messages/chat-page/new-message/NewMessageOutputBoundary";
import { NewMessageOutputData } from "@/usecase/messages/chat-page/new-message/NewMessageOutputData";
import { LoadingChatPageViewModel } from "../LoadingChatPageViewModel";

export class NewMessagePresenter implements NewMessageOutputBoundary {
  viewModel: Map<string, LoadingChatPageViewModel>;

  constructor(viewModel: Map<string, LoadingChatPageViewModel>) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView(outputData: NewMessageOutputData): Promise<void> {
    await this.viewModel
      .get(outputData.messages[0].chat_id)
      ?.laodChatPage(outputData.messages);
    await this.viewModel
      .get(outputData.messages[0].chat_id)
      ?.firePropertyChange();
  }

  async prepareForFailureView(error: Error): Promise<void> {
    throw error;
  }
}
