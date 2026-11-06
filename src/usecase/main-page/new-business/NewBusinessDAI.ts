import { Business } from "@/entity/Business";

export type NewBusinessInput = {
  business: Business;
};

export type NewBusinessOutput = {
  businesses: Business[];
};

export interface NewBusinessDAI {
  newBusiness(input: NewBusinessInput): Promise<NewBusinessOutput>;
}
