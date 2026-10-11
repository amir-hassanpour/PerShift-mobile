import { Business } from "@/entity/Business";
import { Shift } from "@/entity/Shift";
import {
  NewShiftDataAccessInterface,
  NewShiftOutput,
} from "@/usecase/shift/new-shift/NewShiftDataAccessInterface";
import { NewShiftInputData } from "@/usecase/shift/new-shift/NewShiftInputData";
import Storage from "expo-sqlite/kv-store";
import { BusinessRAMDisk } from "../BusinessRAMDisk";

const SHIFTS_KEY = "shifts";

type StoredShift = {
  startTime: string;
  endTime: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  businessID: string;
  shiftID: string;
};

export class BusinessShiftsRAMDisk implements NewShiftDataAccessInterface {
  async newShift(inputData: NewShiftInputData): Promise<NewShiftOutput> {
    await this.saveShift(
      new Shift(
        inputData.startTime,
        inputData.endTime,
        inputData.latitude,
        inputData.longitude,
        inputData.description ?? "",
        inputData.businessid,
        inputData.id,
      ),
    );

    let mostRecentBusienss =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (mostRecentBusienss !== null) {
      return { shifts: await this.getBusinessShifts(mostRecentBusienss) };
    }

    return {
      shifts: await this.getBusinessShifts(new Business("", "", new Date())),
    };
  }

  async saveShift(shift: Shift): Promise<void> {
    const key = `${SHIFTS_KEY}:${shift.businessID}`;
    const storedValue = await Storage.getItem(key);

    const storedShifts: StoredShift[] =
      storedValue === null ? [] : JSON.parse(storedValue);

    if (5 <= storedShifts.length) {
      return;
    }

    for (const tshift of storedShifts) {
      if (shift.shiftID === tshift.shiftID) {
        return;
      }
    }

    const storedShift: StoredShift = {
      startTime: shift.startTime.toISOString(),
      endTime: shift.endTime.toISOString(),
      latitude: shift.latitude,
      longitude: shift.longitude,
      description: shift.description,
      businessID: shift.businessID,
      shiftID: shift.shiftID,
    };

    storedShifts.push(storedShift);

    await Storage.setItem(key, JSON.stringify(storedShifts));
  }

  async getBusinessShifts(business: Business): Promise<Shift[]> {
    const key = `${SHIFTS_KEY}:${business.id}`;
    const storedValue = await Storage.getItem(key);

    if (storedValue === null) {
      return [];
    }

    const storedShifts: StoredShift[] = JSON.parse(storedValue);

    let shiftedShifts = storedShifts.map(
      (shift) =>
        new Shift(
          new Date(shift.startTime),
          new Date(shift.endTime),
          shift.latitude,
          shift.longitude,
          shift.description ?? "",
          shift.businessID,
          shift.shiftID,
        ),
    );

    if (shiftedShifts !== undefined) {
      return shiftedShifts;
    }

    return [];
  }
}
