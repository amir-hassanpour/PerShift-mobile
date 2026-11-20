import { DeleteChatOutputData } from "./DeleteChatOutputData";

export interface DeleteChatOutputBoundary {
  prepareForSuccessView(output: DeleteChatOutputData): void;

  prepapreForFailureView(error: string): void;
}
