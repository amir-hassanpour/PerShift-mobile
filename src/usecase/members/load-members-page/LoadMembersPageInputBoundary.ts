import { LoadMembersPageInputData } from "./LoadMembersPageInputData";

export interface LoadMembersPageInputBoundary {
  loadMembers(inputData: LoadMembersPageInputData): void;
}
