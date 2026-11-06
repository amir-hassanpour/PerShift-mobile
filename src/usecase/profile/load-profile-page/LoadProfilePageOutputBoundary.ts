import { LoadProfilePageOutputData } from "./LoadProfilePageOutputData";

export interface LoadProfilePageOutputBoundary {
  prepareForSuccessView(outputData: LoadProfilePageOutputData): void;

  prepareForFailureVuew(error: string): void;
}
