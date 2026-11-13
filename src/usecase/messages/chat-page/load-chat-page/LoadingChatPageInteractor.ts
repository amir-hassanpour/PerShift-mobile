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

  async laodingChatPage(intputData: LoadingChatPageInputData): Promise<void> {
    try {
      const result = await this.DAO.loadingChatPage({
        chat_id: intputData.chat_id,
      });

      await this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        new Error("couldn't load chat page interactor error"),
      );
    }
  }
}
