import { NewMemberOutputData } from "@/usecase/members/new-member/NewMemberDataAccessInterface";
import { NewMemberOutputBoundary } from "@/usecase/members/new-member/NewMemberOutputBoundary";
import { LoadMembersPageViewModel } from "../LoadMembersPageViewModel";
import { NewMemberState } from "./NewMemberState";

export class NewMemberPresenter implements NewMemberOutputBoundary {
  viewModel: LoadMembersPageViewModel;

  constructor(viewModel: LoadMembersPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(outputData: NewMemberOutputData): void {
    this.viewModel.members = outputData.members;
    this.viewModel.state = NewMemberState.SUCCESS;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = NewMemberState.FAILURE;
    throw new Error(error);
  }
}
