import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/LoadingMainPageViewModel";
import { LoadShiftsOutputBoundary } from "@/usecase/shift/load-shifts/LoadShiftsOutputBoundary";
import { LoadShiftsOutputData } from "@/usecase/shift/load-shifts/LoadShiftsOutputData";
import { LoadShiftsState } from "./LoadShiftsState";

export class LoadShiftsPresenter implements LoadShiftsOutputBoundary {
  viewModel: LoadingMainPageViewModel;

  constructor(viewModel: LoadingMainPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(output: LoadShiftsOutputData): void {
    for (const shift of output.shifts) {
      this.viewModel.shifts.push(shift);
    }
    this.viewModel.state = LoadShiftsState.SUCCESS_LOAD_SHIFTS;
    this.viewModel.shifts.sort(
      (a, b) =>
        a.startTime.getTime() - b.startTime.getTime() ||
        a.shiftID.localeCompare(b.shiftID),
    );
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = LoadShiftsState.FAILURE_LOAD_SHIFTS;
    this.viewModel.firePropertyChange();
  }
}
