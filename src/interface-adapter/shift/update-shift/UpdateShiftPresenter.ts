import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/LoadingMainPageViewModel";
import { UpdateShiftOutputBoundary } from "@/usecase/shift/update-shift/UpdateShiftOutputBoundary";
import { UpdateShiftOutputData } from "@/usecase/shift/update-shift/UpdateShiftOutputData";
import { UpdateShiftState } from "./UpdateShiftState";

export class UpdateShiftPresenter implements UpdateShiftOutputBoundary {
  viewModel: LoadingMainPageViewModel;

  constructor(viewModel: LoadingMainPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(output: UpdateShiftOutputData): void {
    console.log("updating");
    this.viewModel.shifts = this.viewModel.shifts.map((shift) =>
      shift.shiftID === output.updatedShift.shiftID
        ? output.updatedShift
        : shift,
    );

    this.viewModel.shifts.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime(),
    );

    this.viewModel.state = UpdateShiftState.SUCCESS_UPDATE_SHIFT;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = UpdateShiftState.FAILED_UPDATE_SHIFT;
    this.viewModel.firePropertyChange();
  }
}
