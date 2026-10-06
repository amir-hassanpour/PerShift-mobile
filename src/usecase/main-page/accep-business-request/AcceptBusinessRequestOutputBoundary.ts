import { AcceptBusinessRequestOutputData } from "./AcceptBusinessRequestOuputData";

export interface AcceptBusinessRequestOutputBoundary {
  prepareForSuccessView(output: AcceptBusinessRequestOutputData): Promise<void>;

  prepareForFailureView(error: Error): void;
}
