import { User } from "@/entity/User";

export interface LoadHoursPgaeDAI {
  loadHoursPage(input: LoadHoursPageInput): Promise<LoadHoursPageOutput>;
}

export type LoadHoursPageInput = {};

export type LoadHoursPageOutput = {
  users: User[];
};
