import { User } from "@/entity/User";

export type LoadCreateShiftPageInput = {};

export type LoadCreateShiftPageOutput = {
  usersToAdd: User[];
};

export interface LoadCreateShiftPageDAI {
  loadCreateShiftPage(
    input: LoadCreateShiftPageInput,
  ): Promise<LoadCreateShiftPageOutput>;
}
