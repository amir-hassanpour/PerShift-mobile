import { NewMessageOutputBoundary } from "@/usecase/messages/chat-page/new-message/NewMessageOutputBoundary";
import { NewMessageOutputData } from "@/usecase/messages/chat-page/new-message/NewMessageOutputData";
import { LoadingMessagesPageViewModel } from "../../LoadingMessagesPageViewModel";

export class NewMessagePresenter implements NewMessageOutputBoundary {
  viewModel: LoadingMessagesPageViewModel;

  constructor(viewModel: LoadingMessagesPageViewModel) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView(ouputData: NewMessageOutputData): Promise<void> {
    this.viewModel.loadMainPageView;
  }

  async prepareForFailureView(error: Error): Promise<void> {
    console.log(error.message);
  }
}
