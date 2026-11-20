import { ScrollMembersDAI } from "./ScrollMembersDAI";
import { ScrollMembersInputBoundary } from "./ScrollMembersInputBoundary";
import { ScrollMembersInputData } from "./ScrollMembersInputData";
import { ScrollMembersOutputBoundary } from "./ScrollMembersOutputBoundary";

export class ScrollMembersInteractor implements ScrollMembersInputBoundary {
  dao: ScrollMembersDAI;
  outputBoundary: ScrollMembersOutputBoundary;

  constructor(
    dao: ScrollMembersDAI,
    outputBoundary: ScrollMembersOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async scrollMmebers(input: ScrollMembersInputData): Promise<void> {
    try {
      const result = await this.dao.scrollMembers(input);

      this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Scroll members failed interactor error",
      );
    }
  }
}
