import { AddMemberOutputBoundary } from "@/usecase/members/add-member/AddMemberOutputBoundary";
import { LoadMembersPageViewModel } from "../LoadMembersPageViewModel";
import { AddMemberState } from "./AddMemberState";

export class AddMemberPresenter implements AddMemberOutputBoundary {
  viewModel: LoadMembersPageViewModel;

  constructor(viewModel: LoadMembersPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(): void {
    this.viewModel.state = AddMemberState.SUCCESS_ADD_MEMBER;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: Error): void {
    this.viewModel.state = AddMemberState.FAILURE_ADD_MEMBER;
    this.viewModel.firePropertyChange();
  }
}
