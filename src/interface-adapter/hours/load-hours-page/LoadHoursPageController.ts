import { LoadHoursPageInputBoundary } from "@/usecase/hours/load-hours-page/LoadHoursPageInputBoundary";

export class LoadHoursPageController {
  interactor: LoadHoursPageInputBoundary;

  constructor(interactor: LoadHoursPageInputBoundary) {
    this.interactor = interactor;
  }

  async loadHoursPage(input: {}): Promise<void> {
    await this.interactor.loadHoursPage(input);
  }
}
