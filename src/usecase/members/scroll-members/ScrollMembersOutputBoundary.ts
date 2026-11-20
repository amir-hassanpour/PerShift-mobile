import { ScrollMembersOutputData } from "./ScrollMembersOutputData";

export interface ScrollMembersOutputBoundary {
  prepareForSuccessView(output: ScrollMembersOutputData): void;

  prepareForFailureView(error: string): void;
}
