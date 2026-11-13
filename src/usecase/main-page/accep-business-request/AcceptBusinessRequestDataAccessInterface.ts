import { Role } from "@/entity/Role";
import { Business } from "../../../entity/Business";
import { BusinessRequested } from "../../../entity/BusinessRequested";
import { Shift } from "../../../entity/Shift";

export type Acceptinput = {
  businessId: string;
};

export type AcceptOutput = {
  shifts: Shift[];
  businesses: Business[];
  requestedBusinesses: BusinessRequested[];
  role: Role;
};

export interface AcceptBusinessRequestDataAccessInterface {
  acceptBusinessRequest(input: Acceptinput): Promise<AcceptOutput>;
}
