import { LoadingMessagesPageDataAccessInterface } from "./LoadingMessagesPageDataAccessInterface";
import { LoadingMessagesPageInputBoudnary } from "./LoadingMessagesPageInputBoundary";
import { LoadingMessagesPageInputData } from "./LoadingMessagesPageInputData";
import { LoadingMessagesPageOutputBoudnary } from "./LoadingMessagesPageOutputBoundary";
import { LoadingMessagesPageOutputData } from "./LoadingMessagesPageOutputData";

export class LoadingMessagesPageInteractor implements LoadingMessagesPageInputBoudnary {
  DAO: LoadingMessagesPageDataAccessInterface;
  outputBoundary: LoadingMessagesPageOutputBoudnary;

  constructor(
    DAO: LoadingMessagesPageDataAccessInterface,
    outputBoundary: LoadingMessagesPageOutputBoudnary,
  ) {
    this.DAO = DAO;
    this.outputBoundary = outputBoundary;
  }

  async loadMessagesPage(
    inputData: LoadingMessagesPageInputData,
  ): Promise<void> {
    try {
      const chats = (await this.DAO.loadMainPage()).chats;

      const outputData: LoadingMessagesPageOutputData = {
        chats: chats,
      };

      this.outputBoundary.prepareForSuccessView(outputData);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.outputBoundary.prepareForFailureView(err);
    }
  }
}
