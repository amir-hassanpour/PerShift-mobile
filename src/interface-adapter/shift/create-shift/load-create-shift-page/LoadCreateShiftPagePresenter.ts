import { LoadCreateShiftPageOutputBoundary } from "@/usecase/shift/create-shift/load-create-shift-page/LoadCreateShiftPageOutputBoundary";
import { LoadCreateShiftPageOutputData } from "@/usecase/shift/create-shift/load-create-shift-page/LoadCreateShiftPageOutputData";
import { LoadCreateShiftPageViewModel } from "../LoadCreateShiftPageViewModel";
import { LoadCreateShiftPageState } from "./LoadCreateShiftPageState";

export class LoadCreateShiftPagePresenter implements LoadCreateShiftPageOutputBoundary {
  viewModel: LoadCreateShiftPageViewModel;

  constructor(viewModel: LoadCreateShiftPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(output: LoadCreateShiftPageOutputData): void {
    this.viewModel.state = LoadCreateShiftPageState.SUCCESS_LOADING;
    this.viewModel.userToAdd = output.userToAdd;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = LoadCreateShiftPageState.FAILURE_LOADING;
    this.viewModel.firePropertyChange();
  }
}
