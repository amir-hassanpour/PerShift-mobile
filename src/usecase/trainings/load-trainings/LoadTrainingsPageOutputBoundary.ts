import { LoadTrainingsPageOutputData } from "./LoadTrainingsPageOutputData";

export interface LoadTrainingsPageOutputBoundary {
  prepareForSuccessView(outputData: LoadTrainingsPageOutputData): void;

  prepareForFailureView(error: string): void;
}
