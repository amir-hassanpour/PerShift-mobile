import { AddMemberInputData } from "./AddMemberInputData";

export interface AddMemberInputBoundary {
  addMember(input: AddMemberInputData): Promise<void>;
}
