import { NewChatDataAccessInterface } from "./NewChatDataAccessInterface";
import { NewChatInputBoundary } from "./NewChatInputBoundary";
import { NewChatInputData } from "./NewChatInputData";
import { NewChatOutputBoundary } from "./NewChatOutputBoundary";

export class NewChatInteractor implements NewChatInputBoundary {
  DAO: NewChatDataAccessInterface;
  outputBoundary: NewChatOutputBoundary;

  constructor(
    DAO: NewChatDataAccessInterface,
    outputBoundary: NewChatOutputBoundary,
  ) {
    this.DAO = DAO;
    this.outputBoundary = outputBoundary;
  }

  async newChat(inputData: NewChatInputData): Promise<void> {
    try {
      const result = await this.DAO.newChat(inputData);

      await this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      const failure = error instanceof Error ? error : new Error(String(error));
      await this.outputBoundary.prepareForFailureView(failure);
    }
  }
}
