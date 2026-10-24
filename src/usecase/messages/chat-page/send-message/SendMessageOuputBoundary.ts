import { SendMessageOutputData } from "./SendMessageOutputData";

export interface SendMessageOutputBoundary {
  prepareForSuccessView(outputData: SendMessageOutputData): Promise<void>;

  prepareForFailureView(error: string): Promise<void>;
}
