import { LoadingChatPageOutputData } from "./LoadingChatPageOutputData";

export interface LoadingChatPageOutputBoundary {
  prepareForSuccessView(outputData: LoadingChatPageOutputData): Promise<void>;

  prepareForFailureView(error: Error): Promise<void>;
}
