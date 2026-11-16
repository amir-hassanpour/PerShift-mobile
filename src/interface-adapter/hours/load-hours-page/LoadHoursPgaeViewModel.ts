import { User } from "@/entity/User";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { LoadHoursPageState } from "./LoadHoursPgaeState";

export class LoadHoursPageViewModel extends ViewModel {
  state: LoadHoursPageState = LoadHoursPageState.IDLE;
  users: User[] = [];
}
