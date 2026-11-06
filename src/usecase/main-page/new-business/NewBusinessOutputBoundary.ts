import { NewBusinessOutputData } from "./NewBusinesssOutputData";

export interface NewBusinessOutputBoundary {
  prepareForSuccessView(output: NewBusinessOutputData): void;

  prepareForFailureView(error: string): void;
}
