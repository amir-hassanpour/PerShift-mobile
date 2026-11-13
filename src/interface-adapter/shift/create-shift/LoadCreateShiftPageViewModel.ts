import { User } from "@/entity/User";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { CreateShiftState } from "./create-shift/CreateShiftState";
import { LoadCreateShiftPageState } from "./load-create-shift-page/LoadCreateShiftPageState";

export class LoadCreateShiftPageViewModel extends ViewModel {
  state: LoadCreateShiftPageState | CreateShiftState =
    LoadCreateShiftPageState.IDLE_LOADING;
  userToAdd: User[] = [];
}
