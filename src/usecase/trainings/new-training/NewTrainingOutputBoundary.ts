import { NewTrainingOutputData } from "./NewTrainingOutputData";

export interface NewTrainingOutputBoundary {
  prepareForSuccessView(outputData: NewTrainingOutputData): void;

  prepareForFailureView(error: string): void;
}
