import { LoadHoursPgaeDAI } from "./LoadHoursPageDAI";
import { LoadHoursPageInputBoundary } from "./LoadHoursPageInputBoundary";
import { LoadHoursPageOutputBoundary } from "./LoadHoursPageOutputBoundary";

export class LoadHoursPageInteractor implements LoadHoursPageInputBoundary {
  dao: LoadHoursPgaeDAI;
  outputBoundary: LoadHoursPageOutputBoundary;

  constructor(
    dao: LoadHoursPgaeDAI,
    outputBoundary: LoadHoursPageOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async loadHoursPage(input: LoadHoursPageInputBoundary): Promise<void> {
    try {
      const result = await this.dao.loadHoursPage(input);
      this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Couldn't load hours page interactor error.",
      );
    }
  }
}
