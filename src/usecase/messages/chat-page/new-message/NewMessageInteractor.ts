import { NewMessageDataAccessInterface } from "./NewMessageDataAccessInterface";
import { NewMessageInputBoundary } from "./NewMessageInputBoundary";
import { NewMessageInputData } from "./NewMessageInputData";
import { NewMessageOutputBoundary } from "./NewMessageOutputBoundary";

export class NewMeessageInteractor implements NewMessageInputBoundary {
  DAO: NewMessageDataAccessInterface;
  outputBoundary: NewMessageOutputBoundary;

  constructor(
    DAO: NewMessageDataAccessInterface,
    outputBoundary: NewMessageOutputBoundary,
  ) {
    this.DAO = DAO;
    this.outputBoundary = outputBoundary;
  }

  async newMessage(inputData: NewMessageInputData): Promise<void> {
    try {
      const result = await this.DAO.newMessage(inputData);

      this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      const failure = error instanceof Error ? error : new Error(String(error));
      await this.outputBoundary.prepareForFailureView(failure);
    }
  }
}
