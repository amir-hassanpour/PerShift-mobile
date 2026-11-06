import { LoadProfilePageDAI } from "./LoadProfilePageDAI";
import { LoadProfilePageInputData } from "./LoadProfilePageInputData";
import { LoadProfilePageOutputBoundary } from "./LoadProfilePageOutputBoundary";

export class LoadProfilePageInteractor {
  dao: LoadProfilePageDAI;
  outputBoundary: LoadProfilePageOutputBoundary;

  constructor(
    dao: LoadProfilePageDAI,
    outputBoundary: LoadProfilePageOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async loadProfilePage(inputData: LoadProfilePageInputData) {
    try {
      const result = await this.dao.loadProfilePage({});
      this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureVuew(
        "profile page doesn't load interactor error",
      );
    }
  }
}
