import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { User } from "@/entity/User";

export type LoadProfileInput = {};

export type LoadProfileOutput = {
  user: User;
  businesses: Business[];
  businessesRequested: BusinessRequested[];
};

export interface LoadProfilePageDAI {
  loadProfilePage(inputData: LoadProfileInput): Promise<LoadProfileOutput>;
}
