import { LoadTrainingPageOutputBoundary } from "@/usecase/trainings/training-page/load-training-page/LoadTrainingPageOutputBoundary";
import { LoadTrainingPageOutputData } from "@/usecase/trainings/training-page/load-training-page/LoadTrainingPageOutputData";
import { LoadTrainingPageViewModel } from "../LoadTrainingPageViewModel";

export class LoadTrainingPagePresenter implements LoadTrainingPageOutputBoundary {
  viewModel: LoadTrainingPageViewModel;

  constructor(viewModel: LoadTrainingPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(outputData: LoadTrainingPageOutputData): void {
    this.viewModel.modules = outputData.modules;
    this.viewModel.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    throw new Error("COULDN'T LOAD THE TRAINING PAGE PRESENTER ERROR");
  }
}
