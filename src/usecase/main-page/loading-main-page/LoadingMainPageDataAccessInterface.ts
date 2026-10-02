import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { Shift } from "@/entity/Shift";

export type LoadMainPage = {
  businesses: Business[];
  businessRequested: BusinessRequested[];
  shifts: Shift[];
};

export interface LoadingMainPageDataAccessInterface {
  loadMainPage(): Promise<LoadMainPage>;
}
