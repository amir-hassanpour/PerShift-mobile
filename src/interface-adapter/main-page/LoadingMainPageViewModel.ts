import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { Shift } from "@/entity/Shift";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { AcceptBusinessRequestState } from "./accept-business-request/AcceptBusinessRequestState";
import { DeclineBusinessRequestState } from "./decline-business-request/DeclineBusinessRequestState";
import { LoadingMainPageStates } from "./load-main-page/LoadingMainPageState";

export class LoadingMainPageViewModel extends ViewModel {
  state:
    | LoadingMainPageStates
    | DeclineBusinessRequestState
    | AcceptBusinessRequestState;
  shifts: Shift[] | [] = [];
  businesses: Business[] | [] = [];
  businessRequested: BusinessRequested[] | [] = [];

  constructor(
    state:
      | LoadingMainPageStates
      | DeclineBusinessRequestState
      | AcceptBusinessRequestState,
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
    );
  }

  setLoadingMainPageViewModel(
    bus: Business[],
    busReq: BusinessRequested[],
    shifts: Shift[],
  ): void {
    this.businessRequested = busReq;
    this.businesses = bus;
    this.shifts = shifts;
  }

  async firePropertyChange(): Promise<void> {
    super.firePropertyChange();
  }
}
