import { ChatExistsOutputData } from "./ChatExistsOutputData";

export interface ChatExistsOutputBoundary {
  prepareForSuccessView(output: ChatExistsOutputData): void;

  prepareForFailureView(error: string): void;
}
