import { LoadHoursPageOutputBoundary } from "@/usecase/hours/load-hours-page/LoadHoursPageOutputBoundary";
import { LoadHoursPageOutputData } from "@/usecase/hours/load-hours-page/LoadHoursPageOutputData";
import { LoadHoursPageState } from "./LoadHoursPgaeState";
import { LoadHoursPageViewModel } from "./LoadHoursPgaeViewModel";

export class LoadHoursPagePresenter implements LoadHoursPageOutputBoundary {
  viewModel: LoadHoursPageViewModel;

  constructor(viewModel: LoadHoursPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(output: LoadHoursPageOutputData): void {
    this.viewModel.state = LoadHoursPageState.SUCCESS_LOAD_HOURS_PAGE;
    this.viewModel.users = output.users;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = LoadHoursPageState.FAILURE_LOAD_HOURS_PAGE;
    this.viewModel.firePropertyChange();
  }
}
