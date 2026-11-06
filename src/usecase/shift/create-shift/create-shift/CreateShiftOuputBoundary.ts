import { CreateShiftOutputData } from "./CreateShiftOutputData";

export interface CreateShiftOutputBoundary {
  prepareForSuccessView(output: CreateShiftOutputData): void;

  prepareForFailureView(error: string): void;
}
