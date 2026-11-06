import { NewMemberInputData } from "./NewMemberInputData";

export interface NewMemberInputBoundary {
  newMember(inputData: NewMemberInputData): Promise<void>;
}
