import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { Shift } from "@/entity/Shift";
import { LoadingMainPageStates } from "./LoadingMainPageState";

export class LoadingMainPageViewModel {
  state: LoadingMainPageStates;
  shifts: Shift[] | [] = [];
  businesses: Business[] | [] = [];
  businessRequested: BusinessRequested[] | [] = [];

  constructor(state: LoadingMainPageStates) {
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
  }
}
