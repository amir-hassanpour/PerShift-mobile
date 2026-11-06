import { User } from "@/entity/User";

export type CreateShiftInputData = {
  userToAdd: User[];
  startTime: Date;
  endTime: Date;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  businessID: string;
};
