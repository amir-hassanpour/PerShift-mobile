import { AcceptBusinessRequestOutputData } from "./AcceptBusinessRequestOutputData";

export interface AcceptBusinessRequestOutputBoundary {
  prepareForSuccessView(output: AcceptBusinessRequestOutputData): Promise<void>;

  prepareForFailureView(error: Error): void;
}
