import { NewChatOutputData } from "./NewChatOutputData";

export interface NewChatOutputBoundary {
  prepareForSuccessView(outputData: NewChatOutputData): Promise<void>;

  prepareForFailureView(error: Error): Promise<void>;
}
