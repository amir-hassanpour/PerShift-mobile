import { NewTrainingOutputBoundary } from "@/usecase/trainings/new-training/NewTrainingOutputBoundary";
import { NewTrainingOutputData } from "@/usecase/trainings/new-training/NewTrainingOutputData";
import { LoadTrainingsPageViewModel } from "../LoadTrainingsPageViewModel";
import { NewTrainingState } from "./NewTrainingState";

export class NewTrainingPresenter implements NewTrainingOutputBoundary {
  viewModel: LoadTrainingsPageViewModel;

  constructor(viewModel: LoadTrainingsPageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(outputData: NewTrainingOutputData): void {
    this.viewModel.trainings = outputData.trainings;
    this.viewModel.state = NewTrainingState.SUCCESS;
    this.viewModel.firePropertyChange();
  }
  prepareForFailureView(error: string): void {
    new Error(error);
  }
}
