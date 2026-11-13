import { NewChatOutputBoundary } from "@/usecase/messages/new-chat/NewChatOutputBoundary";
import { NewChatOutputData } from "@/usecase/messages/new-chat/NewChatOutputData";
import { LoadingMessagesPageViewModel } from "../LoadingMessagesPageViewModel";
import { NewChatState } from "./NewChatState";

export class NewChatPresenter implements NewChatOutputBoundary {
  viewModel: LoadingMessagesPageViewModel;

  constructor(viewModel: LoadingMessagesPageViewModel) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView(outputData: NewChatOutputData): Promise<void> {
    this.viewModel.state = NewChatState.SUCCESS;
    this.viewModel.loadMainPageView(outputData.chats);
    await this.viewModel.firePropertyChange();
  }

  async prepareForFailureView(error: Error): Promise<void> {
    throw error;
  }
}
