import { LoadTrainingsPageDataAccessInterface } from "./LoadTrainingsPageDataAccessInterface";
import { LoadTrainingsPageInputBoundary } from "./LoadTrainingsPageInputBoundary";
import { LoadTrainingsPageInputData } from "./LoadTrainingsPageInputData";
import { LoadTrainingsPageOutputBoundary } from "./LoadTrainingsPageOutputBoundary";

export class LoadTrainingsPageInteractor implements LoadTrainingsPageInputBoundary {
  dao: LoadTrainingsPageDataAccessInterface;
  outputBoundary: LoadTrainingsPageOutputBoundary;

  constructor(
    dao: LoadTrainingsPageDataAccessInterface,
    outputBoundary: LoadTrainingsPageOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async loadTrainingsPage(
    inputData: LoadTrainingsPageInputData,
  ): Promise<void> {
    try {
      const result = await this.dao.loadTrainingsData({});

      await this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Couldn't load the training page error in the interactor",
      );
    }
  }
}
