import { NewTrainingInputData } from "./NewTrainingInputData";

export interface NewTrainingInputBoundary {
  newTraining(inputData: NewTrainingInputData): void;
}
