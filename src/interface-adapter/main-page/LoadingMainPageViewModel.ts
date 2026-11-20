import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { Role } from "@/entity/Role";
import { Shift } from "@/entity/Shift";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { CreateShiftState } from "../shift/create-shift/create-shift/CreateShiftState";
import { DeleteShiftState } from "../shift/delete-shift/DeleteShiftState";
import { LoadShiftsState } from "../shift/load-shifts/LoadShiftsState";
import { NewShiftState } from "../shift/new-shift/NewShiftState";
import { UpdateShiftState } from "../shift/update-shift/UpdateShiftState";
import { AcceptBusinessRequestState } from "./accept-business-request/AcceptBusinessRequestState";
import { DeclineBusinessRequestState } from "./decline-business-request/DeclineBusinessRequestState";
import { LoadingMainPageStates } from "./load-main-page/LoadingMainPageState";
import { NewBusinessRequestState } from "./new-business-request/NewBusinessRequestState";
import { NewBusinessState } from "./new-business/NewBusinessState";

export class LoadingMainPageViewModel extends ViewModel {
  state:
    | LoadingMainPageStates
    | DeclineBusinessRequestState
    | AcceptBusinessRequestState
    | NewShiftState
    | NewBusinessState
    | NewBusinessRequestState
    | CreateShiftState
    | LoadShiftsState
    | DeleteShiftState
    | UpdateShiftState;
  shifts: Shift[] = [];
  businesses: Business[] = [];
  businessRequested: BusinessRequested[] = [];
  role: Role | undefined = undefined;

  constructor(
    state:
      | LoadingMainPageStates
      | DeclineBusinessRequestState
      | AcceptBusinessRequestState
      | NewShiftState,
  ) {
    super();
    this.state = state;
  }

  setDeclineBusinessRequestViewModel(
    businessRequested: BusinessRequested[],
  ): void {
    this.setLoadingMainPageViewModel(
      this.businesses,
      businessRequested,
      this.shifts,
      this.role,
    );
  }

  setLoadingMainPageNewShift(newShifts: Shift[]) {
    this.setLoadingMainPageViewModel(
      this.businesses,
      this.businessRequested,
      newShifts,
      this.role,
    );
  }

  setLoadingMainPageViewModel(
    bus: Business[],
    busReq: BusinessRequested[],
    shifts: Shift[],
    role: Role | undefined,
  ): void {
    this.businessRequested = busReq;
    this.businesses = bus;
    this.shifts = shifts;
    this.role = role;
  }

  async firePropertyChange(): Promise<void> {
    super.firePropertyChange();
  }
}
