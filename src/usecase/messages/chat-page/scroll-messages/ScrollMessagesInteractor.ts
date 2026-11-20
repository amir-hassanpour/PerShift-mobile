import { ScrollMessagesDAI } from "./ScrollMessagesDAI";
import { ScrollMessagesInputBoundary } from "./ScrollMessagesInputBoundary";
import { ScrollMessagesInputData } from "./ScrollMessagesInputData";
import { ScrollMessagesOutputBoundary } from "./ScrollMessagesOutputBoundary";

export class ScrollMessagesInteractor implements ScrollMessagesInputBoundary {
  dao: ScrollMessagesDAI;
  outputBoundary: ScrollMessagesOutputBoundary;

  constructor(
    dao: ScrollMessagesDAI,
    outputBoundary: ScrollMessagesOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async scrollMessages(input: ScrollMessagesInputData): Promise<void> {
    try {
      const result = await this.dao.scrollMessages(input);

      this.outputBoundary.prepareForSuccessView({ messages: result.messages });
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Messages scroll failed interactor error",
      );
    }
  }
}
