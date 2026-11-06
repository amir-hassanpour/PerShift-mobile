import { User } from "@/entity/User";

export type LoadMembersInput = {};

export type LoadMembersOutput = {
  members: User[];
};

export interface LoadMembersPageDataAccessInterface {
  loadMembers(inputData: LoadMembersInput): Promise<LoadMembersOutput>;
}
