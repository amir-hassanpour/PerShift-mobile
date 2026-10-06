import { BusinessRequested } from "@/entity/BusinessRequested";

export type DeclineBusinessRequestInput = {
  businessId: string;
};

export type DeclineBusinessRequestOutput = {
  businessRequested: BusinessRequested[];
};

export interface DeclineBusinessRequestDataAccessInterface {
  declineBusinessRequest(
    declineBusinessRequest: DeclineBusinessRequestInput,
  ): Promise<DeclineBusinessRequestOutput>;
}
