import { UpdateShiftInteractor } from "@/usecase/shift/update-shift/UpdateShiftInteractor";

export class UpdateShiftController {
  interacotr: UpdateShiftInteractor;

  constructor(interacotr: UpdateShiftInteractor) {
    this.interacotr = interacotr;
  }

  async updateShift(input: {
    startTime: Date;
    endTime: Date;
    latitude: number | null;
    longitude: number | null;
    businessID: string;
    shiftID: string;
    description: string | null;
  }) {
    await this.interacotr.updateShift(input);
  }
}
