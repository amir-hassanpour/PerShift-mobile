import { LoadingMessagesPageOutputBoudnary } from "@/usecase/loading-messages-page/LoadingMessagesPageOutputBoundary";
import { LoadingMessagesPageOutputData } from "@/usecase/loading-messages-page/LoadingMessagesPageOutputData";
import { LoadingMessagesPageViewModel } from "../LoadingMessagesPageViewModel";
import { LoadingMessagesPageState } from "./LoadingMessagesPageState";

export class LoadingMessagesPagePresenter implements LoadingMessagesPageOutputBoudnary {
  viewModel: LoadingMessagesPageViewModel;

  constructor(viewModel: LoadingMessagesPageViewModel) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView(
    outputData: LoadingMessagesPageOutputData,
  ): Promise<void> {
    this.viewModel.chats = outputData.chats;
    this.viewModel.state = LoadingMessagesPageState.SUCCESS;
    this.viewModel.firePropertyChange();
  }

  async prepareForFailureView(error: Error): Promise<void> {
    this.viewModel.state = LoadingMessagesPageState.FAILURE;
  }
}
