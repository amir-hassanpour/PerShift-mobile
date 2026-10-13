import { LoadingChatPageOutputBoundary } from "@/usecase/messages/chat-page/load-chat-page/LoadingChatPageOutputBoundary";
import { LoadingChatPageOutputData } from "@/usecase/messages/chat-page/load-chat-page/LoadingChatPageOutputData";
import { LoadingChatPageViewModel } from "../LoadingChatPageViewModel";
import { LoadingChatPageState } from "./LoadingChatPageState";

export class LoadingChatPagePresenter implements LoadingChatPageOutputBoundary {
  viewModel: LoadingChatPageViewModel;

  constructor(viewModel: LoadingChatPageViewModel) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView(
    outputData: LoadingChatPageOutputData,
  ): Promise<void> {
    await this.viewModel.laodChatPage(outputData.messages);
    this.viewModel.state = LoadingChatPageState.SUCCESS;
  }

  async prepareForFailureView(error: Error): Promise<void> {
    console.log(error.message);
  }
}
