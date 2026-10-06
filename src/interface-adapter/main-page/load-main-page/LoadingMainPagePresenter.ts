import { LoadingMainPageOutputBoundary } from "@/usecase/main-page/loading-main-page/LoadingMainPageOutputBoundary";
import { LoadingMainPageOutputData } from "@/usecase/main-page/loading-main-page/LoadingMainPageOutputData";
import { LoadingMainPageViewModel } from "../LoadingMainPageViewModel";
import { LoadingMainPageStates } from "./LoadingMainPageState";

export class LoadingMainPagePresenter implements LoadingMainPageOutputBoundary {
  viewModel: LoadingMainPageViewModel;
  constructor(viewModel: LoadingMainPageViewModel) {
    this.viewModel = viewModel;
  }
  async prepareForSuccessView(
    outputData: LoadingMainPageOutputData,
  ): Promise<void> {
    let businesses = outputData.businesses;
    let businessRequested = outputData.businessRequested;
    let shifts = outputData.shifts;

    let state: LoadingMainPageStates | undefined = undefined;

    if (businesses.length === 0) {
      state = LoadingMainPageStates.NO_BUSINESS;
      if (businessRequested.length === 0) {
        state = LoadingMainPageStates.NO_REQUEST;
      }
    } else if (shifts.length === 0 && businesses.length > 0) {
      state = LoadingMainPageStates.NO_SHIFT_YES_BUSINESS;
    } else {
      state = LoadingMainPageStates.SUCCESS;
    }
    this.viewModel.state = state;
    this.viewModel.setLoadingMainPageViewModel(
      businesses,
      businessRequested,
      shifts,
    );
    this.viewModel.firePropertyChange();
  }

  async prepareForFailureView(error: string): Promise<void> {
    this.viewModel.state = LoadingMainPageStates.FAILURE;
    this.viewModel.setLoadingMainPageViewModel([], [], []);
    this.viewModel.firePropertyChange();
  }
}
