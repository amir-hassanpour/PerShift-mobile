import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/LoadingMainPageViewModel";
import { DeleteShiftOutputBoundary } from "@/usecase/shift/delete-shift/DeleteShiftOutputBoundary";
import { DeleteShiftOutputData } from "@/usecase/shift/delete-shift/DeleteShiftOutputData";
import { DeleteShiftState } from "./DeleteShiftState";

export class DeleteShiftPresenter implements DeleteShiftOutputBoundary {
  viewModel: LoadingMainPageViewModel;

  constructor(viewModel: LoadingMainPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(output: DeleteShiftOutputData): void {
    this.viewModel.shifts = this.viewModel.shifts.filter(
      (shiftV) => shiftV.shiftID !== output.shiftID,
    );
    this.viewModel.shifts.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime(),
    );

    this.viewModel.state = DeleteShiftState.SUCCESS_DELETE_SHIFT;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = DeleteShiftState.FAILED_DELETE_SHIFT;
    this.viewModel.firePropertyChange();
  }
}
