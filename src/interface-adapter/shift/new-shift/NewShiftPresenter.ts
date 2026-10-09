import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/LoadingMainPageViewModel";
import { NewShiftOutputBoundary } from "@/usecase/shift/new-shift/NewShiftOutputBoundary";
import { NewShiftOutputData } from "@/usecase/shift/new-shift/NewShiftOutputData";
import { NewShiftState } from "./NewShiftState";

export class NewShiftPresenter implements NewShiftOutputBoundary {
  viewModel: LoadingMainPageViewModel;

  constructor(viewModel: LoadingMainPageViewModel) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView(outputData: NewShiftOutputData): Promise<void> {
    this.viewModel.state = NewShiftState.SUCCESS;
    this.viewModel.setLoadingMainPageNewShift(outputData.shifts);
    this.viewModel.firePropertyChange();
  }

  async prepareForFailureView(error: string): Promise<void> {
    this.viewModel.state = NewShiftState.FAILURE;
    console.log(error);
  }
}
