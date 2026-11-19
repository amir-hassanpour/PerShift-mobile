import { LoadMembersPageOutputBoundary } from "@/usecase/members/load-members-page/LoadMembersPageOutputBoundary";
import { LoadMembersPageOutputData } from "@/usecase/members/load-members-page/LoadMembersPageOutputData";
import { LoadMembersPageViewModel } from "../LoadMembersPageViewModel";
import { LoadMembersPageState } from "./LoadMembersPageState";

export class LoadMembersPagePresenter implements LoadMembersPageOutputBoundary {
  viewModel: LoadMembersPageViewModel;

  constructor(viewModel: LoadMembersPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccsessView(outputData: LoadMembersPageOutputData): void {
    this.viewModel.members = outputData.members;
    this.viewModel.state = LoadMembersPageState.SUCCESS;
    this.viewModel.roles = outputData.roles;
    this.viewModel.canAddMembers = outputData.canAddMembers;

    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = LoadMembersPageState.FAILURE;
    throw new Error(error);
  }
}
