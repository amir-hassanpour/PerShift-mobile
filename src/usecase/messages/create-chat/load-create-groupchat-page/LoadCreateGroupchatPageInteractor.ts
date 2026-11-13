import { LoadCreateGroupchatPageDAI } from "./LoadCreateGroupchatPageDAI";
import { LoadCreateGroupchatPageInputBoundary } from "./LoadCreateGroupchatPageInputBoundary";
import { LoadCreateGroupchatPageInputData } from "./LoadCreateGroupchatPageInputData";
import { LoadCreateGroupchatPageOutputBoundary } from "./LoadCreateGroupchatPageOutputBoundary";

export class LoadCreateGroupchatPageInteractor implements LoadCreateGroupchatPageInputBoundary {
  dao: LoadCreateGroupchatPageDAI;
  outputBoundary: LoadCreateGroupchatPageOutputBoundary;

  constructor(
    dao: LoadCreateGroupchatPageDAI,
    outputBoundary: LoadCreateGroupchatPageOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async loadCreateGroupchatPage(
    input: LoadCreateGroupchatPageInputData,
  ): Promise<void> {
    try {
      const result = await this.dao.loadCreateGroupchatPage(input);

      this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Unable to load create chat page interactor error",
      );
    }
  }
}
