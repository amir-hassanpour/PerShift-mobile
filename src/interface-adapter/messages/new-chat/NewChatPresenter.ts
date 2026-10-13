import { NewChatOutputBoundary } from "@/usecase/messages/new-chat/NewChatOutputBoundary";
import { NewChatOutputData } from "@/usecase/messages/new-chat/NewChatOutputData";
import { LoadingMessagesPageViewModel } from "../LoadingMessagesPageViewModel";
import { NewChatState } from "./NewChatState";

export class NewChatPresenter implements NewChatOutputBoundary {
  viewMode: LoadingMessagesPageViewModel;

  constructor(viewModel: LoadingMessagesPageViewModel) {
    this.viewMode = viewModel;
  }

  async prepareForSuccessView(outputData: NewChatOutputData): Promise<void> {
    this.viewMode.state = NewChatState.SUCCESS;
    this.viewMode.loadMainPageView(outputData.chats);
  }

  async prepareForFailureView(error: Error): Promise<void> {
    console.log(error.message);
  }
}
