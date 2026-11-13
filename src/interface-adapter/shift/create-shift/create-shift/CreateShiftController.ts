import { User } from "@/entity/User";
import { CreateShiftInteractor } from "@/usecase/shift/create-shift/create-shift/CreateShiftInteractor";

export type Input = {
  startTime: Date | null;
  endTime: Date | null;
  address: string;
  description: string;
  users: User[];
  businessID: string;
};

export class CreateShiftController {
  interactor: CreateShiftInteractor;

  constructor(interactor: CreateShiftInteractor) {
    this.interactor = interactor;
  }

  async createShift(input: Input) {
    await this.interactor.createShift(input);
  }
}
