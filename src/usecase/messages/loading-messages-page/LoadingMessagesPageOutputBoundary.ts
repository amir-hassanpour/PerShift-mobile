import { LoadingMessagesPageOutputData } from "./LoadingMessagesPageOutputData";

export interface LoadingMessagesPageOutputBoudnary {
  prepareForSuccessView(
    outputData: LoadingMessagesPageOutputData,
  ): Promise<void>;

  prepareForFailureView(error: Error): Promise<void>;
}
