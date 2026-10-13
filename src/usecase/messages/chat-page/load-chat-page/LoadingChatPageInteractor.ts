import { LoadingChatPageDataAccessInterface } from "./LoadingChatPageDataAccessInterface";
import { LoadingChatPageInputBoundary } from "./LoadingChatPageInputBoundary";
import { LoadingChatPageInputData } from "./LoadingChatPageInputData";
import { LoadingChatPageOutputBoundary } from "./LoadingChatPageOutputBoundary";

export class LoadingChatPageInteractor implements LoadingChatPageInputBoundary {
  DAO: LoadingChatPageDataAccessInterface;
  outputBoundary: LoadingChatPageOutputBoundary;

  constructor(
    DAO: LoadingChatPageDataAccessInterface,
    outputBoundary: LoadingChatPageOutputBoundary,
  ) {
    this.DAO = DAO;
    this.outputBoundary = outputBoundary;
  }

  laodingChatPage(intputData: LoadingChatPageInputData): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
