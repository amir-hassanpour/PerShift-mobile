import { LoadHoursPageOutputData } from "./LoadHoursPageOutputData";

export interface LoadHoursPageOutputBoundary {
  prepareForSuccessView(output: LoadHoursPageOutputData): void;

  prepareForFailureView(error: string): void;
}
