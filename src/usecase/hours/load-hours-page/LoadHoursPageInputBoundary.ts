import { LoadHoursPageInputData } from "./LoadHoursPageInputData";

export interface LoadHoursPageInputBoundary {
  loadHoursPage(input: LoadHoursPageInputData): Promise<void>;
}
