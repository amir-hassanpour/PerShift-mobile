import { LoadCreateShiftPageOutputData } from "./LoadCreateShiftPageOutputData";

export interface LoadCreateShiftPageOutputBoundary {
  prepareForSuccessView(output: LoadCreateShiftPageOutputData): void;

  prepareForFailureView(error: string): void;
}
