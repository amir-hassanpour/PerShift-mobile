import { ViewModel } from "@/interface-adapter/ViewModel";
import { CheckHoursState } from "./CheckHoursState";

export class CheckHoursViewModel extends ViewModel {
  state: CheckHoursState = CheckHoursState.IDLE_CHECK_HOURS;
  totalHours: number = 0;
  totalMinutes: number = 0;
}
