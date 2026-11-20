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

  async deleteShiftByID(shiftID: string): Promise<void> {
    const task = BusinessShiftsRAMDisk.shiftSaveQueue.then(async () => {
      const keys = await Storage.getAllKeys();

      const shiftKeys = keys.filter(
        (key) => key.startsWith(`${SHIFTS_KEY}:`) && !key.endsWith(":limit"),
      );

      for (const key of shiftKeys) {
        const value = await Storage.getItem(key);
        if (value === null) continue;

        const shifts: StoredShift[] = JSON.parse(value);
        const remaining = shifts.filter((shift) => shift.shiftID !== shiftID);

        if (remaining.length === shifts.length) continue;

        await Storage.setItem(key, JSON.stringify(remaining));
      }
    });

    BusinessShiftsRAMDisk.shiftSaveQueue = task.catch(() => {});
    await task;
  }

  async createShift(input: CreateShiftInput): Promise<createShiftOutput> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const shift = input.shift;

    const { error: shiftError } = await supabase.from("shift").insert({
      id: shift.shiftID,
      start_time: shift.startTime.toISOString(),
      end_time: shift.endTime.toISOString(),
      longitude: shift.longitude,
      latitude: shift.latitude,
      business_id: shift.businessID,
      owner: user.id,
      description: shift.description,
    });

    if (shiftError) throw shiftError;

    const profileIDs = [...new Set(input.userToAdd.map((member) => member.id))];

    if (profileIDs.length > 0) {
      const { error: assignmentError } = await supabase
        .from("shift_assignment")
        .insert(
          profileIDs.map((profileID) => ({
            shift_id: shift.shiftID,
            profile_id: profileID,
            business_id: shift.businessID,
            owner: user.id,
          })),
        );

      if (assignmentError) {
        throw assignmentError;
      }
    }

    await this.saveShift(shift, true);

    return {
      shifts: await this.getBusinessShifts(shift.businessID),
    };
  }

  async newShift(inputData: NewShiftInputData): Promise<NewShiftOutput> {
    await this.saveShift(
      new Shift(
        inputData.startTime,
        inputData.endTime,
        inputData.latitude,
        inputData.longitude,
        inputData.businessid,
        inputData.id,
        inputData.description ?? "",
      ),
      true,
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error();

    let mostRecentBusienss =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (mostRecentBusienss !== null) {
      return { shifts: await this.getBusinessShifts(mostRecentBusienss.id) };
    }

    return {
      shifts: await this.getBusinessShifts(inputData.businessid),
    };
  }

  async saveShift(shift: Shift, shiftCreated: boolean = false): Promise<void> {
    const key = `${SHIFTS_KEY}:${shift.businessID}`;
    const limitKey = `${key}:limit`;

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
      const storedLimit = await Storage.getItem(limitKey);

      const existing: StoredShift[] =
        storedValue === null ? [] : JSON.parse(storedValue);

      let limit = Math.max(5, existing.length, Number(storedLimit) || 5);

      const shiftsById = new Map(existing.map((item) => [item.shiftID, item]));

      if (shiftCreated && !shiftsById.has(storedShift.shiftID)) {
        limit += 1;
      }

      shiftsById.set(storedShift.shiftID, storedShift);

      const shifts = Array.from(shiftsById.values())
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime() ||
            a.shiftID.localeCompare(b.shiftID),
        )
        .slice(0, limit);

      await Storage.setItem(key, JSON.stringify(shifts));
      await Storage.setItem(limitKey, String(limit));
    });

    // Keep later saves running even if this save fails.
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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error();

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
