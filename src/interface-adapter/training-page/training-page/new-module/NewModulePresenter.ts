import { NewModuleOutputBoundary } from "@/usecase/trainings/training-page/new-module/NewModuleOutputBoundary";
import { NewModuleOutputData } from "@/usecase/trainings/training-page/new-module/NewModuleOutputData";
import { LoadTrainingPageViewModel } from "../LoadTrainingPageViewModel";

export class NewModulePresenter implements NewModuleOutputBoundary {
  viewModel: Map<string, LoadTrainingPageViewModel>;

  constructor(viewModel: Map<string, LoadTrainingPageViewModel>) {
    this.viewModel = viewModel;
  }

  prepareForSuccesView(outputData: NewModuleOutputData): void {
    const firstModule = outputData.modules[0];
    if (!firstModule) return;

    const trainingViewModel = this.viewModel.get(firstModule.training_id);
    if (!trainingViewModel) return;
    trainingViewModel.modules = outputData.modules;
    trainingViewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    throw new Error("modules of trainig wasn't rcieved");
  }
}
