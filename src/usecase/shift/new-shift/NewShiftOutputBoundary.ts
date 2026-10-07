import { NewShiftOutputData } from "./NewShiftOutputData";

export interface NewShiftOutputBoundary {
  prepareForSuccessView(outputData: NewShiftOutputData): Promise<void>;

  prepareForFailureView(error: string): Promise<void>;
}
