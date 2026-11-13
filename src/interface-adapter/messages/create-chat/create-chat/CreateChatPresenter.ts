import { CreateChatOutputBoundary } from "@/usecase/messages/create-chat/create-chat/CreateChatOutputBoundary";
import { CreateChatOutputData } from "@/usecase/messages/create-chat/create-chat/CreateChatOutputData";
import { LoadCreateGroupchatPageState } from "../load-create-group-chat-page/LoadCreateGroupchatPageState";
import { LoadCreateGroupchatPageViewModel } from "../load-create-group-chat-page/LoadCreateGroupchatPageViewModel";
import { LoadCreateChatPageViewModel } from "../LoadCreateChatPageViewModel";
import { CreateChatState } from "./CreateChatState";
import { CreateChatViewModel } from "./CreateChatViewModel";

export class CreateChatPresenter implements CreateChatOutputBoundary {
  viewModel: CreateChatViewModel;
  loadCreateChatViewModel: LoadCreateChatPageViewModel;
  viewModelGroupChat: LoadCreateGroupchatPageViewModel;

  constructor(
    viewModel: CreateChatViewModel,
    loadCreateChatViewModel: LoadCreateChatPageViewModel,
    viewModelGroupChat: LoadCreateGroupchatPageViewModel,
  ) {
    this.loadCreateChatViewModel = loadCreateChatViewModel;
    this.viewModel = viewModel;
    this.viewModelGroupChat = viewModelGroupChat;
  }

  preparepForSuccessView(output: CreateChatOutputData): void {
    this.viewModel.chat = output.chat;
    this.viewModel.state = CreateChatState.SUCCESS_CREATE_CHAT;
    this.loadCreateChatViewModel.chatUsers = output.chats;
    this.loadCreateChatViewModel.firePropertyChange();
    this.viewModel.firePropertyChange();
  }

  prepareForMinimumUserRequirementFailure(): void {
    this.viewModelGroupChat.state =
      LoadCreateGroupchatPageState.LOAD_CCREATE_GROUPCHAT_PAGE_MINIMUM_MEMBERS_FAILED;
    this.viewModelGroupChat.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = CreateChatState.FAILURE_CREATE_CHAT;
    throw new Error(error);
  }
}
