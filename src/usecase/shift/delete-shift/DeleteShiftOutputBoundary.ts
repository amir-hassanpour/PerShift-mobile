import { DeleteShiftOutputData } from "./DeleteShiftOutputData";

export interface DeleteShiftOutputBoundary {
  prepareForSuccessView(output: DeleteShiftOutputData): void;

  prepareForFailureView(error: string): void;
}
