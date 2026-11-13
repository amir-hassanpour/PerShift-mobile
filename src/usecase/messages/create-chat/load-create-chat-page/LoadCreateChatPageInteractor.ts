import { LoadCreateChatPageDAI } from "./LoadCreateChatPageDAI";
import { LoadCreateChatPageInputBoundary } from "./LoadCreateChatPageInputBoundary";
import { LoadCreateChatPageInputData } from "./LoadCreateChatPageInputData";
import { LoadCreateChatPageOutputBoundary } from "./LoadCreateChatPageOutputBoundary";

export class LoadCreateChatPageInteractor implements LoadCreateChatPageInputBoundary {
  dao: LoadCreateChatPageDAI;
  outputBoundary: LoadCreateChatPageOutputBoundary;

  constructor(
    dao: LoadCreateChatPageDAI,
    outputBoundary: LoadCreateChatPageOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async loadCreateChatPage(
    inputData: LoadCreateChatPageInputData,
  ): Promise<void> {
    try {
      const result = await this.dao.loadCreateChatPage({});

      await this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Couldn't load the create chat page interactor error",
      );
    }
  }
}
