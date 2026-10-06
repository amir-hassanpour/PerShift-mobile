import { AcceptBusinessRequestOutputData } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestOuputData";
import { AcceptBusinessRequestOutputBoundary } from "../../../usecase/main-page/accep-business-request/AcceptBusinessRequestOutputBoundary";
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
  }: AcceptBusinessRequestOutputData): Promise<void> {
    this.viewModel.state = AcceptBusinessRequestState.SUCCESS;
    this.viewModel.setLoadingMainPageViewModel(
      businesses,
      requestedBusinesses,
      shifts,
    );
  }

  prepareForFailureView(error: Error): void {
    console.log(error.message);
  }
}
