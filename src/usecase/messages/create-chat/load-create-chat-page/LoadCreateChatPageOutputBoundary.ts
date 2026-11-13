import { LoadCreateChatPageOutputData } from "./LoadCreateChatPageOutputData";

export interface LoadCreateChatPageOutputBoundary {
  prepareForSuccessView(outputData: LoadCreateChatPageOutputData): void;

  prepareForFailureView(error: string): void;
}
