import { Business } from "../../../entity/Business";
import { BusinessRequested } from "../../../entity/BusinessRequested";
import { Shift } from "../../../entity/Shift";

export type AcceptBusinessRequestOutputData = {
  shifts: Shift[];
  businesses: Business[];
  requestedBusinesses: BusinessRequested[];
};
