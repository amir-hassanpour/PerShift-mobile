import { DeclineBusinessRequestOutputBoundary } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestOutputBoundary";
import { DeclineBusinessRequestOutputData } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestOutputData";
import { LoadingMainPageViewModel } from "../LoadingMainPageViewModel";
import { DeclineBusinessRequestState } from "./DeclineBusinessRequestState";

export class DeclineBusinessRequestPresenter implements DeclineBusinessRequestOutputBoundary {
  viewModel: LoadingMainPageViewModel;

  constructor(viewModel: LoadingMainPageViewModel) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView(
    outputData: DeclineBusinessRequestOutputData,
  ): Promise<void> {
    this.viewModel.state = DeclineBusinessRequestState.SUCCESS;
    this.viewModel.setDeclineBusinessRequestViewModel(
      outputData.businessRequested,
    );
  }

  async prepareForFailureView(error: string): Promise<void> {
    this.viewModel.state = DeclineBusinessRequestState.FAILURE;
  }
}
