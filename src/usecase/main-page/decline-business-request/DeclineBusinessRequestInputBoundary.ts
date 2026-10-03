import { DeclineBusinessRequestInputData } from "./DeclineBusinessRequestInputData";

export interface DeclineBusinessRequestInputBoundary {
  declineBusinessRequest(
    inputData: DeclineBusinessRequestInputData,
  ): Promise<void>;
}
