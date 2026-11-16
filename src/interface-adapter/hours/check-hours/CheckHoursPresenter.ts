import { CheckHoursOutputBoundary } from "@/usecase/hours/check-hours/CheckHoursOutputBoundary";
import { CheckHoursState } from "./CheckHoursState";
import { CheckHoursViewModel } from "./CheckHoursViewModel";

export class CheckHoursPresenter implements CheckHoursOutputBoundary {
  viewModel: CheckHoursViewModel;

  constructor(viewModel: CheckHoursViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(outputData: {
    totalHours: number;
    totalMinutes: number;
  }): void {
    this.viewModel.state = CheckHoursState.SUCCESS_CHECK_HOURS;
    this.viewModel.totalHours = outputData.totalHours;
    this.viewModel.totalMinutes = outputData.totalMinutes;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(errorMessage: string): void {
    this.viewModel.state = CheckHoursState.FAILURE_CHECK_HOURS;
    this.viewModel.firePropertyChange();
  }
}
