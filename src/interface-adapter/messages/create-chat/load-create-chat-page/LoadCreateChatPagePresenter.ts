import { LoadCreateChatPageOutputBoundary } from "@/usecase/messages/create-chat/load-create-chat-page/LoadCreateChatPageOutputBoundary";
import { LoadCreateChatPageOutputData } from "@/usecase/messages/create-chat/load-create-chat-page/LoadCreateChatPageOutputData";
import { LoadCreateChatPageViewModel } from "../LoadCreateChatPageViewModel";
import { LoadCreateChatPageState } from "./LoadCreateChatPageState";

export class LoadCreateChatPagePresenter implements LoadCreateChatPageOutputBoundary {
  viewModelChatPage: LoadCreateChatPageViewModel;

  constructor(viewModelChatPage: LoadCreateChatPageViewModel) {
    this.viewModelChatPage = viewModelChatPage;
  }

  prepareForSuccessView(outputData: LoadCreateChatPageOutputData): void {
    this.viewModelChatPage.chatUsers = [
      ...outputData.chats,
      ...outputData.users,
    ];
    this.viewModelChatPage.state =
      LoadCreateChatPageState.SUCCESS_LOADING_CREATE_CHAT;
    this.viewModelChatPage.businessID = outputData.businessID;
    this.viewModelChatPage.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModelChatPage.state =
      LoadCreateChatPageState.FAILURE_LOADING_CREATE_CHAT;
    this.viewModelChatPage.firePropertyChange();
  }
}
