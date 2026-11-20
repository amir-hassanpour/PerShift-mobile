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
    for (const member of outputData.members) {
      let exists = false;
      for (const memberViewModel of this.viewModel.members) {
        if (member.id === memberViewModel.id) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        this.viewModel.members.push(member);
      }
    }
    this.viewModel.state = NewMemberState.SUCCESS;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = NewMemberState.FAILURE;
    this.viewModel.firePropertyChange();
    throw new Error(error);
  }
}
