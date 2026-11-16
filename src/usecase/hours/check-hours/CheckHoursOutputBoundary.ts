import { CheckHoursOutputData } from "./CheckHoursOutputData";

export interface CheckHoursOutputBoundary {
  prepareForSuccessView(output: CheckHoursOutputData): void;

  prepareForFailureView(error: string): void;
}
