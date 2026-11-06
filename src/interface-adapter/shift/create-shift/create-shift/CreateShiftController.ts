import { User } from "@/entity/User";
import { CreateShiftInteractor } from "@/usecase/shift/create-shift/create-shift/CreateShiftInteractor";

export class CreateShiftController {
  interactor: CreateShiftInteractor;

  constructor(interactor: CreateShiftInteractor) {
    this.interactor = interactor;
  }

  async eateShift(input: {
    userToAdd: User[];
    startTime: Date;
    endTime: Date;
    latitude: number | null;
    longitude: number | null;
    description: string | null;
    businessID: string;
  }) {
    await this.interactor.createShift(input);
  }
}
