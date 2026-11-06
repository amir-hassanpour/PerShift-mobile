import { Shift } from "@/entity/Shift";
import * as Crypto from "expo-crypto";
import { CreateShiftDAI } from "./CreateShiftDAI";
import { CreateShiftInputBoundary } from "./CreateShiftInputBoundary";
import { CreateShiftInputData } from "./CreateShiftInputData";
import { CreateShiftOutputBoundary } from "./CreateShiftOuputBoundary";

export class CreateShiftInteractor implements CreateShiftInputBoundary {
  dao: CreateShiftDAI;
  outputBoundary: CreateShiftOutputBoundary;

  constructor(dao: CreateShiftDAI, outputBoundary: CreateShiftOutputBoundary) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async createShift(input: CreateShiftInputData): Promise<void> {
    try {
      const id: string = Crypto.randomUUID();
      const result = await this.dao.createShift({
        shift: new Shift(
          input.startTime,
          input.endTime,
          input.latitude,
          input.longitude,
          input.businessID,
          id,
          input.description,
        ),
      });
      await this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Create shift couldn't go through",
      );
    }
  }
}
