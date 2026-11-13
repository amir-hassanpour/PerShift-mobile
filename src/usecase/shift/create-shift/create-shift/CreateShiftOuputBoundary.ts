import { CreateShiftOutputData } from "./CreateShiftOutputData";

export interface CreateShiftOutputBoundary {
  prepareForSuccessView(output: CreateShiftOutputData): void;

  prepareForStartTimeMissingView(): void;

  prepareForEndTimeMissingVlaue(): void;

  prepareForInvalidTimeView(): void;

  prepareForFailureView(error: string): void;
}
