import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { Shift } from "@/entity/Shift";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { LoadingMainPageStates } from "./LoadingMainPageState";

export class LoadingMainPageViewModel extends ViewModel {
  state: LoadingMainPageStates;
  shifts: Shift[] | [] = [];
  businesses: Business[] | [] = [];
  businessRequested: BusinessRequested[] | [] = [];

  constructor(state: LoadingMainPageStates) {
    super();
    this.state = state;
  }

  setLoadingMainPageViewModel(
    bus: Business[],
    busReq: BusinessRequested[],
    shifts: Shift[],
  ): void {
    this.businessRequested = busReq;
    this.businesses = bus;
    this.shifts = shifts;
    super.firePropertyChange();
  }
}
