import { User } from "@/entity/User";
import { CheckHoursInteractor } from "@/usecase/hours/check-hours/CheckHoursInteractor";

export class CheckHoursController {
  interactor: CheckHoursInteractor;

  constructor(interactor: CheckHoursInteractor) {
    this.interactor = interactor;
  }

  async checkHours(inputData: {
    startDate: Date;
    endDate: Date;
    user: User[];
  }): Promise<void> {
    await this.interactor.checkHours(inputData);
  }
}
