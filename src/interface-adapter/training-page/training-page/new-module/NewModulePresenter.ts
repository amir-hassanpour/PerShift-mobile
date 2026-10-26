import { NewModuleOutputBoundary } from "@/usecase/trainings/training-page/new-module/NewModuleOutputBoundary";
import { NewModuleOutputData } from "@/usecase/trainings/training-page/new-module/NewModuleOutputData";
import { LoadTrainingPageViewModel } from "../LoadTrainingPageViewModel";

export class NewModulePresenter implements NewModuleOutputBoundary {
  viewModel: LoadTrainingPageViewModel;

  constructor(viewModel: LoadTrainingPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccesView(outputData: NewModuleOutputData): void {
    this.viewModel.modules = outputData.modules;
    this.viewModel.firePropertyChange();
  }
  prepareForFailureView(error: string): void {
    throw new Error("modules of trainig wasn't rcieved");
  }
}
