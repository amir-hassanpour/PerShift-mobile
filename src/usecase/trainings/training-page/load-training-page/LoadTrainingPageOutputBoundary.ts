import { LoadTrainingPageOutputData } from "./LoadTrainingPageOutputData";

export interface LoadTrainingPageOutputBoundary {
  prepareForSuccessView(outputData: LoadTrainingPageOutputData): void;

  prepareForFailureView(error: string): void;
}
