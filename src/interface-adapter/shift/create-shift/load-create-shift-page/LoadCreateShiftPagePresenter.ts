import { LoadCreateShiftPageOutputBoundary } from "@/usecase/shift/create-shift/load-create-shift-page/LoadCreateShiftPageOutputBoundary";
import { LoadCreateShiftPageOutputData } from "@/usecase/shift/create-shift/load-create-shift-page/LoadCreateShiftPageOutputData";
import { LoadCreateShiftPageState } from "./LoadCreateShiftPageState";
import { LoadCreateShiftPageViewModel } from "./LoadCreateShiftPageViewModel";

export class LoadCreateShiftPagePresenter implements LoadCreateShiftPageOutputBoundary {
  viewModel: LoadCreateShiftPageViewModel;

  constructor(viewModel: LoadCreateShiftPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(output: LoadCreateShiftPageOutputData): void {
    this.viewModel.state = LoadCreateShiftPageState.SUCCESS;
    this.viewModel.userToAdd = output.userToAdd;
  }

  prepareForFailureView(error: string): void {
    this.viewModel.state = LoadCreateShiftPageState.SUCCESS;
    throw new Error(error);
  }
}
