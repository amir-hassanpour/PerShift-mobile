import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { Role } from "@/entity/Role";
import { Shift } from "@/entity/Shift";

export type LoadMainPage = {
  role: Role | undefined;
  businesses: Business[];
  businessRequested: BusinessRequested[];
  shifts: Shift[];
};

export interface LoadingMainPageDataAccessInterface {
  loadMainPage(): Promise<LoadMainPage>;
}
