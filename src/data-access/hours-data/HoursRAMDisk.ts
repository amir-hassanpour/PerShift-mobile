import { User, type UserProps } from "@/entity/User";
import Storage from "expo-sqlite/kv-store";

export type HoursForUser = {
  user: User;
  totalMinutes: number;
  totalHours: number;
};

type StoredHoursForUser = {
  user: Omit<UserProps, "createdAt"> & {
    createdAt: string;
  };
  totalMinutes: number;
  totalHours: number;
};

const HOURS_KEY = "hours";
const MAX_USERS = 20;

export class HoursRAMDisk {
  private static saveQueue: Promise<void> = Promise.resolve();

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const task = HoursRAMDisk.saveQueue.then(operation);

    HoursRAMDisk.saveQueue = task.then(
      () => {},
      () => {},
    );

    return task;
  }

  private getKey(startDate: Date, endDate: Date): string {
    const start = startDate.getTime();
    const end = endDate.getTime();

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      throw new Error("Hours date range contains an invalid date");
    }

    if (start > end) {
      throw new Error("Start date must not be after end date");
    }

    return `${HOURS_KEY}:${start}:${end}`;
  }

  async getHours(input: {
    startDate: Date;
    endDate: Date;
    users: User[];
  }): Promise<HoursForUser[]> {
    const key = this.getKey(input.startDate, input.endDate);
    const users = [...input.users];

    return this.enqueue(async () => {
      const value = await Storage.getItem(key);

      if (value === null) return [];

      const stored: StoredHoursForUser[] = JSON.parse(value);

      const hoursByUserID = new Map(stored.map((item) => [item.user.id, item]));

      const requestedUsers = new Map(users.map((user) => [user.id, user]));

      const result: HoursForUser[] = [];

      for (const userID of requestedUsers.keys()) {
        const item = hoursByUserID.get(userID);

        if (!item) continue;

        result.push({
          user: new User({
            ...item.user,
            createdAt: new Date(item.user.createdAt),
          }),
          totalMinutes: item.totalMinutes,
          totalHours: item.totalHours,
        });
      }

      return result;
    });
  }

  async saveHours(input: {
    startDate: Date;
    endDate: Date;
    hoursForUsers: HoursForUser[];
  }): Promise<void> {
    const key = this.getKey(input.startDate, input.endDate);
    const hoursByUserID = new Map<string, StoredHoursForUser>();

    for (const item of input.hoursForUsers) {
      if (!Number.isFinite(item.totalMinutes) || item.totalMinutes < 0) {
        throw new Error("Total minutes must be a non-negative number");
      }

      if (!Number.isFinite(item.totalHours) || item.totalHours < 0) {
        throw new Error("Total hours must be a non-negative number");
      }

      if (!Number.isFinite(item.user.createdAt.getTime())) {
        throw new Error("User has an invalid createdAt date");
      }

      hoursByUserID.set(item.user.id, {
        user: {
          id: item.user.id,
          firstName: item.user.firstName,
          lastName: item.user.lastName,
          username: item.user.username,
          email: item.user.email,
          createdAt: item.user.createdAt.toISOString(),
          avatarUrl: item.user.avatarUrl ?? null,
        },
        totalMinutes: item.totalMinutes,
        totalHours: item.totalHours,
      });
    }

    const snapshot = JSON.stringify(
      [...hoursByUserID.values()].slice(0, MAX_USERS),
    );
    await this.enqueue(async () => {
      await Storage.setItem(key, snapshot);
    });
  }

  async deleteAllHours(): Promise<void> {
    await this.enqueue(async () => {
      const keys = await Storage.getAllKeys();

      for (const key of keys) {
        if (key.startsWith(`${HOURS_KEY}:`)) {
          await Storage.removeItem(key);
        }
      }
    });
  }
}
