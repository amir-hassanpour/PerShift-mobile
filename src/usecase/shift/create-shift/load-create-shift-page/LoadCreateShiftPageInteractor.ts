import { LoadCreateShiftPageDAI } from "./LoadCreateShiftPageDAI";
import { LoadCreateShiftPageInputBoundary } from "./LoadCreateShiftPageInputBoundary";
import { LoadCreateShiftPageInputData } from "./LoadCreateShiftPageInputData";
import { LoadCreateShiftPageOutputBoundary } from "./LoadCreateShiftPageOutputBoundary";

export class LoadCreateShiftPageInteractor implements LoadCreateShiftPageInputBoundary {
  dao: LoadCreateShiftPageDAI;
  outputBoundary: LoadCreateShiftPageOutputBoundary;

  constructor(
    dao: LoadCreateShiftPageDAI,
    outputBoundary: LoadCreateShiftPageOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async loadCreateShiftPage(
    input: LoadCreateShiftPageInputData,
  ): Promise<void> {
    try {
      const result = await this.dao.loadCreateShiftPage(input);

      this.outputBoundary.prepareForSuccessView({
        userToAdd: result.usersToAdd,
      });
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Unable to load the Create Shift page. Please try again.",
      );
    }
  }
}
