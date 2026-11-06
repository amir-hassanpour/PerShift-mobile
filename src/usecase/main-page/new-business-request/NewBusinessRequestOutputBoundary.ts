import { NewBusinessRequestOutputData } from "./NewBusinessRequestOutputData";

export interface NewBusinessRequestOutputBoundary {
  prepareForSuccesView(output: NewBusinessRequestOutputData): void;

  prepareForFailureView(error: string): void;
}
