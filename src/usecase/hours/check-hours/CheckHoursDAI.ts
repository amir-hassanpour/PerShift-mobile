import { User } from "@/entity/User";

export type CheckHoursInput = {
  startDate: Date;
  endDate: Date;
  user: User[];
};

export type CheckHoursOutput = {
  totalHours: number;
  totalMinutes: number;
};

export interface CheckHoursDAI {
  checkHours(input: CheckHoursInput): Promise<CheckHoursOutput>;
}
