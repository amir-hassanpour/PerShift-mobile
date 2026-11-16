import { User } from "@/entity/User";

export type CheckHoursInputData = {
  startDate: Date;
  endDate: Date;
  user: User[];
};
