import { BusinessRequested } from "@/entity/BusinessRequested";

export type NewBusinessRequestInput = {
  businessRequest: BusinessRequested;
};

export type NewBusinessRequestOutput = {
  businessesRequested: BusinessRequested[];
};

export interface NewBusinessRequestDAI {
  newBusinessRequested(
    input: NewBusinessRequestInput,
  ): Promise<NewBusinessRequestOutput>;
}
