import { DeclineBusinessRequestOutputData } from "./DeclineBusinessRequestOutputData";

export interface DeclineBusinessRequestOutputBoundary {
  prepareForSuccessView(
    outputData: DeclineBusinessRequestOutputData,
  ): Promise<void>;

  prepareForFailureView(error: string): Promise<void>;
}
