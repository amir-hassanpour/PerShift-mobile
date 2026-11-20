import { DeleteChatDAI } from "./DeleteChatDAI";
import { DeleteChatInputBoundary } from "./DeleteChatInputBoundary";
import { DeleteChatInputData } from "./DeleteChatInputData";
import { DeleteChatOutputBoundary } from "./DeleteChatOutputBoundary";

export class DeleteChatInteractor implements DeleteChatInputBoundary {
  dao: DeleteChatDAI;
  outputBoundary: DeleteChatOutputBoundary;

  constructor(dao: DeleteChatDAI, outputBoundary: DeleteChatOutputBoundary) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async deleteChat(input: DeleteChatInputData): Promise<void> {
    try {
      const result = await this.dao.deleteChat(input);

      this.outputBoundary.prepareForSuccessView({ chatID: input.chatID });
    } catch (error) {
      this.outputBoundary.prepapreForFailureView(
        "Delete chat failed interactor error",
      );
    }
  }
}
