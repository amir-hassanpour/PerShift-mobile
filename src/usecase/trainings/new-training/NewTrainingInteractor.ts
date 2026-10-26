import { NewTrainingDataAccessInterface } from "./NewTrainingDataAccessInterface";
import { NewTrainingInputBoundary } from "./NewTrainingInputBoundary";
import { NewTrainingInputData } from "./NewTrainingInputData";
import { NewTrainingOutputBoundary } from "./NewTrainingOutputBoundary";

export class NewTrainingInteractor implements NewTrainingInputBoundary {
  DAO: NewTrainingDataAccessInterface;
  outputBoundary: NewTrainingOutputBoundary;

  constructor(
    DAO: NewTrainingDataAccessInterface,
    outputBoundary: NewTrainingOutputBoundary,
  ) {
    this.DAO = DAO;
    this.outputBoundary = outputBoundary;
  }

  async newTraining(inputData: NewTrainingInputData): Promise<void> {
    try {
      const result = await this.DAO.newTraining(inputData);

      this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "The New trainign couldn't be added problem cause in interactor",
      );
    }
  }
}
