import { ScrollMembersOutputBoundary } from "@/usecase/members/scroll-members/ScrollMembersOutputBoundary";
import { ScrollMembersOutputData } from "@/usecase/members/scroll-members/ScrollMembersOutputData";
import { LoadMembersPageViewModel } from "../LoadMembersPageViewModel";
import { ScrollMembersState } from "./ScrollMembersState";

export class ScrollMembersPresenter implements ScrollMembersOutputBoundary {
  viewModel: LoadMembersPageViewModel;

  constructor(viewModel: LoadMembersPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(output: ScrollMembersOutputData): void {
    for (const member of output.members) {
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
    this.viewModel.state = ScrollMembersState.SUCCESS_SCROLL_MEMBERS;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = ScrollMembersState.FAILED_SCROLL_MEMBERS;
    this.viewModel.firePropertyChange();
  }
}
