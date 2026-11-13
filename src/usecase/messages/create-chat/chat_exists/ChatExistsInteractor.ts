import { ChatExistsDAI } from "./ChatExistsDAI";
import { ChatExistsInputBoundary } from "./ChatExistsInputBoundary";
import { ChatExistsInputData } from "./ChatExistsInputData";
import { ChatExistsOutputBoundary } from "./ChatExistsOutputBoundary";

export class ChatExistsInteractor implements ChatExistsInputBoundary {
  dao: ChatExistsDAI;
  outputBoundary: ChatExistsOutputBoundary;

  constructor(dao: ChatExistsDAI, outputBoundary: ChatExistsOutputBoundary) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async chatExists(input: ChatExistsInputData): Promise<void> {
    try {
      const result = await this.dao.chatEsists(input);

      this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Couldn't check if chat exists",
      );
    }
  }
}
