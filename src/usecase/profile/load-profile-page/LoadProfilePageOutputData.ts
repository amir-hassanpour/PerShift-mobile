import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { User } from "@/entity/User";

export type LoadProfilePageOutputData = {
  user: User;
  businesses: Business[];
  businessesRequested: BusinessRequested[];
};
