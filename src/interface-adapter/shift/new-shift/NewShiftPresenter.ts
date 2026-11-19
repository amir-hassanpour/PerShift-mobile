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
    for (const shift of outputData.shifts) {
      let exists = false;
      for (const shiftViewModel of this.viewModel.shifts) {
        if (shift.shiftID === shiftViewModel.shiftID) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        this.viewModel.shifts.push(shift);
      }
    }
    this.viewModel.state = NewShiftState.SUCCESS;
    this.viewModel.shifts.sort(
      (a, b) =>
        a.startTime.getTime() - b.startTime.getTime() ||
        a.shiftID.localeCompare(b.shiftID),
    );
    this.viewModel.firePropertyChange();
  }

  async prepareForFailureView(error: string): Promise<void> {
    this.viewModel.state = NewShiftState.FAILURE;
  }
}
