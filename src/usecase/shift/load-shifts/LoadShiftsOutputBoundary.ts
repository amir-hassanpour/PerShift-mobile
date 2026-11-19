import { LoadShiftsOutputData } from "./LoadShiftsOutputData";

export interface LoadShiftsOutputBoundary {
  prepareForSuccessView(output: LoadShiftsOutputData): void;

  prepareForFailureView(error: string): void;
}
