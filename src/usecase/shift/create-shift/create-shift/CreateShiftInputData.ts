import { User } from "@/entity/User";

export type CreateShiftInputData = {
  startTime: Date | null;
  endTime: Date | null;
  address: string;
  description: string;
  users: User[];
  businessID: string;
};
