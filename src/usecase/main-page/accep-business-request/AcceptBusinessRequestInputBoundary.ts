import { AcceptBusinessRequestInputData } from "./AcceptBusinessRequestInputData";

export interface AcceptBusinessRequestInputBoundary {
  acceptBusinessRequest(input: AcceptBusinessRequestInputData): Promise<void>;
}
