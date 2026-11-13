import { LoadCreateGroupchatPageOutputData } from "./LoadCreateGroupchatPageOutputData";

export interface LoadCreateGroupchatPageOutputBoundary {
  prepareForSuccessView(output: LoadCreateGroupchatPageOutputData): void;

  prepareForFailureView(error: string): void;
}
