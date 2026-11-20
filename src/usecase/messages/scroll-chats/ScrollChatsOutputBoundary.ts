import { ScrollChatsOutputData } from "./ScrollChatsOutputData";

export interface ScrollChatsOutputBoundary {
  prepareForSuccessView(output: ScrollChatsOutputData): void;

  prepareForFailureView(error: string): void;
}
