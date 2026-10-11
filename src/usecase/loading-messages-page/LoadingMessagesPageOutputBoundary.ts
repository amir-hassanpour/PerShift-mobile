import { LoadingMessagesPageOutputData } from "./LoadingMessagesPageOutputData";

export interface LoadingMessagesPageOutputBoudnary {
  prepareForSuccessView(
    outputData: LoadingMessagesPageOutputData,
  ): Promise<void>;

  prepareForFailureView(error: string): Promise<void>;
}
