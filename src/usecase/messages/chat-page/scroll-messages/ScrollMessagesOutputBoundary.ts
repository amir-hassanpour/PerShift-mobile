import { ScrollMessagesOutputData } from "./ScrollMessagesOutputData";

export interface ScrollMessagesOutputBoundary {
  prepareForSuccessView(output: ScrollMessagesOutputData): void;

  prepareForFailureView(error: string): void;
}
