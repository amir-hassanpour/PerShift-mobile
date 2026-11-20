import { ScrollChatsDAI } from "./ScrollChatsDAI";
import { ScrollChatsInputBoundary } from "./ScrollChatsInputBoundary";
import { ScrollChatsInputData } from "./ScrollChatsInputData";
import { ScrollChatsOutputBoundary } from "./ScrollChatsOutputBoundary";

export class ScrollChatsInteractor implements ScrollChatsInputBoundary {
  dao: ScrollChatsDAI;
  outputBoudnary: ScrollChatsOutputBoundary;

  constructor(dao: ScrollChatsDAI, outputBoudnary: ScrollChatsOutputBoundary) {
    this.dao = dao;
    this.outputBoudnary = outputBoudnary;
  }

  async scrollChats(input: ScrollChatsInputData): Promise<void> {
    try {
      const result = await this.dao.scrollChats(input);

      this.outputBoudnary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoudnary.prepareForFailureView(
        "Scroll chats failed ineractor error",
      );
    }
  }
}
