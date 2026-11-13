import { LoadCreateGroupchatPageOutputBoundary } from "@/usecase/messages/create-chat/load-create-groupchat-page/LoadCreateGroupchatPageOutputBoundary";
import { LoadCreateGroupchatPageOutputData } from "@/usecase/messages/create-chat/load-create-groupchat-page/LoadCreateGroupchatPageOutputData";
import { LoadCreateGroupchatPageState } from "./LoadCreateGroupchatPageState";
import { LoadCreateGroupchatPageViewModel } from "./LoadCreateGroupchatPageViewModel";

export class LoadCreateGroupchatPagePresenter implements LoadCreateGroupchatPageOutputBoundary {
  viewModel: LoadCreateGroupchatPageViewModel;

  constructor(viewModel: LoadCreateGroupchatPageViewModel) {
    this.viewModel = viewModel;
  }
  prepareForSuccessView(output: LoadCreateGroupchatPageOutputData): void {
    this.viewModel.users = output.users;
    this.viewModel.businessID = output.businessID;
    this.viewModel.state =
      LoadCreateGroupchatPageState.LOAD_CREATE_GROUPCHAT_PAGE_SUCCESS;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state =
      LoadCreateGroupchatPageState.LOAD_CREATE_GROUPCHAT_PAGE_FAILURE;
    this.viewModel.firePropertyChange();
  }
}
