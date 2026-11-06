import { User } from "@/entity/User";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { LoadCreateShiftPageState } from "./LoadCreateShiftPageState";

export class LoadCreateShiftPageViewModel extends ViewModel {
  state: LoadCreateShiftPageState = LoadCreateShiftPageState.IDLE;
  userToAdd: User[] = [];
}
