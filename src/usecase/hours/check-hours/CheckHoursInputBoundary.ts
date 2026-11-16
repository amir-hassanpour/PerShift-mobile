import { CheckHoursInputData } from "./CheckHoursInputData";

export interface CheckHoursInputBoundary {
  checkHours(input: CheckHoursInputData): Promise<void>;
}
