import { CheckHoursDAI } from "./CheckHoursDAI";
import { CheckHoursInputBoundary } from "./CheckHoursInputBoundary";
import { CheckHoursInputData } from "./CheckHoursInputData";
import { CheckHoursOutputBoundary } from "./CheckHoursOutputBoundary";

export class CheckHoursInteractor implements CheckHoursInputBoundary {
  dao: CheckHoursDAI;
  outputBoundary: CheckHoursOutputBoundary;

  constructor(dao: CheckHoursDAI, outputBoundary: CheckHoursOutputBoundary) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async checkHours(input: CheckHoursInputData): Promise<void> {
    try {
      const result = await this.dao.checkHours({
        user: input.user,
        startDate: input.startDate,
        endDate: input.endDate,
      });
      this.outputBoundary.prepareForSuccessView({
        totalHours: result.totalHours,
        totalMinutes: result.totalMinutes,
      });
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Check hours failed interactor error.",
      );
    }
  }
}
