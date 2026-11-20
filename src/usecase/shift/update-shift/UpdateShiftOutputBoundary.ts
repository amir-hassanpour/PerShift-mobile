import { UpdateShiftOutputData } from "./UpdateShiftOutputData";

export interface UpdateShiftOutputBoundary {
  prepareForSuccessView(output: UpdateShiftOutputData): void;

  prepareForFailureView(error: string): void;
}
