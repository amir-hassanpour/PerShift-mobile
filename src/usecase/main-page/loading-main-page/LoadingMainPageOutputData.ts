import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { Role } from "@/entity/Role";
import { Shift } from "@/entity/Shift";

export type LoadingMainPageOutputData = {
  businesses: Business[];
  businessRequested: BusinessRequested[];
  shifts: Shift[];
  role: Role | undefined;
};
