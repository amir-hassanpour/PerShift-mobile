import { AcceptBusinessRequestOutputBoundary } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestOutputBoundary";
import { AcceptBusinessRequestOutputData } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestOutputData";
import { LoadingMainPageViewModel } from "../LoadingMainPageViewModel";
import { AcceptBusinessRequestState } from "./AcceptBusinessRequestState";

export class AcceptBusinessRequestPresenter implements AcceptBusinessRequestOutputBoundary {
  viewModel: LoadingMainPageViewModel;
  constructor(viewModel: LoadingMainPageViewModel) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView({
    shifts,
    businesses,
    requestedBusinesses,
    role,
  }: AcceptBusinessRequestOutputData): Promise<void> {
    this.viewModel.state = AcceptBusinessRequestState.SUCCESS;
    this.viewModel.setLoadingMainPageViewModel(
      businesses,
      requestedBusinesses,
      shifts,
      role,
    );
    this.viewModel.firePropertyChange();
  }

  async prepareForFailureView(error: Error): Promise<void> {
    this.viewModel.firePropertyChange();
  }
}
