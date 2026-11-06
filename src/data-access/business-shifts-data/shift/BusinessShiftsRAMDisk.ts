import { supabase } from "@/data-access/supabase/client";
import { Shift } from "@/entity/Shift";
import {
  CreateShiftDAI,
  CreateShiftInput,
  createShiftOutput,
} from "@/usecase/shift/create-shift/create-shift/CreateShiftDAI";
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

export class BusinessShiftsRAMDisk
  implements NewShiftDataAccessInterface, CreateShiftDAI
{
  private static shiftSaveQueue: Promise<void> = Promise.resolve();

  async createShift(input: CreateShiftInput): Promise<createShiftOutput> {
    await this.saveShift(input.shift);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const { error } = await supabase.from("shift").insert({
      id: input.shift.shiftID,
      strart_time: input.shift.startTime,
      end_time: input.shift.endTime,
      longitude: input.shift.longitude,
      latitude: input.shift.latitude,
      busienss_id: input.shift.businessID,
      owner: user.id,
      description: input.shift.description,
    });

    if (error) throw error;

    return { shifts: await this.getBusinessShifts(input.shift.businessID) };
  }

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
      return { shifts: await this.getBusinessShifts(mostRecentBusienss.id) };
    }

    return {
      shifts: await this.getBusinessShifts(""),
    };
  }

  async saveShift(shift: Shift): Promise<void> {
    const key = `${SHIFTS_KEY}:${shift.businessID}`;

    const storedShift: StoredShift = {
      startTime: shift.startTime.toISOString(),
      endTime: shift.endTime.toISOString(),
      latitude: shift.latitude,
      longitude: shift.longitude,
      description: shift.description,
      businessID: shift.businessID,
      shiftID: shift.shiftID,
    };

    const task = BusinessShiftsRAMDisk.shiftSaveQueue.then(async () => {
      const storedValue = await Storage.getItem(key);

      const existing: StoredShift[] =
        storedValue === null ? [] : JSON.parse(storedValue);

      const shiftsById = new Map(existing.map((item) => [item.shiftID, item]));

      shiftsById.set(storedShift.shiftID, storedShift);

      const shifts = Array.from(shiftsById.values())
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime() ||
            a.shiftID.localeCompare(b.shiftID),
        )
        .slice(0, 5);

      await Storage.setItem(key, JSON.stringify(shifts));
    });

    BusinessShiftsRAMDisk.shiftSaveQueue = task.catch(() => {});
    await task;
  }

  async getBusinessShifts(businessID: string): Promise<Shift[]> {
    const key = `${SHIFTS_KEY}:${businessID}`;
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
          shift.businessID,
          shift.shiftID,
          shift.description ?? "",
        ),
    );

    if (shiftedShifts !== undefined) {
      return shiftedShifts;
    }

    return [];
  }

  async deleteAllShifts(): Promise<void> {
    const task = BusinessShiftsRAMDisk.shiftSaveQueue.then(async () => {
      const keys = await Storage.getAllKeys();

      const shiftKeys = keys.filter((key) => key.startsWith(`${SHIFTS_KEY}:`));

      for (const key of shiftKeys) {
        await Storage.removeItem(key);
      }
    });

    BusinessShiftsRAMDisk.shiftSaveQueue = task.catch(() => {});
    await task;
  }
}
