import { ChatExistsOutputBoundary } from "@/usecase/messages/create-chat/chat_exists/ChatExistsOutputBoundary";
import { ChatExistsOutputData } from "@/usecase/messages/create-chat/chat_exists/ChatExistsOutputData";
import { ChatExistsState } from "./ChatExistsState";
import { ChatExistsViewModel } from "./ChatExistsViewModel";

export class ChatExistsPresenter implements ChatExistsOutputBoundary {
  viewModel: ChatExistsViewModel;

  constructor(viewModel: ChatExistsViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(output: ChatExistsOutputData): void {
    this.viewModel.state = ChatExistsState.SUCCESS_CHAT_EXISTS;
    this.viewModel.chat = output.chat;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = ChatExistsState.FAILURE_CHAT_EXISTS;
    this.viewModel.firePropertyChange();
    throw new Error(error);
  }
}
