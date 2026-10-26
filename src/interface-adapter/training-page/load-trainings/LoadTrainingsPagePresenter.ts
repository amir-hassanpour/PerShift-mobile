import { LoadTrainingsPageOutputBoundary } from "@/usecase/trainings/load-trainings/LoadTrainingsPageOutputBoundary";
import { LoadTrainingsPageOutputData } from "@/usecase/trainings/load-trainings/LoadTrainingsPageOutputData";
import { LoadTrainingsPageViewModel } from "../LoadTrainingsPageViewModel";

export class LoadTrainingsPagePresenter implements LoadTrainingsPageOutputBoundary {
  viewModel: LoadTrainingsPageViewModel;

  constructor(viewModel: LoadTrainingsPageViewModel) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView(
    outputData: LoadTrainingsPageOutputData,
  ): Promise<void> {
    await this.viewModel.loadTrainingsPage(outputData.trainings);
  }
  prepareForFailureView(error: string): void {
    throw new Error(error);
  }
}
