import { Business } from "@/entity/Business";
import { Shift } from "@/entity/Shift";
import Storage from "expo-sqlite/kv-store";

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

export class BusinessShiftsRAMDisk {
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
