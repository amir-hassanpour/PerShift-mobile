import { Role } from "@/entity/Role";
import { User } from "@/entity/User";

export type LoadMembersInput = {};

export type LoadMembersOutput = {
  members: User[];
  canAddMembers: boolean;
  roles: Role[];
};

export interface LoadMembersPageDataAccessInterface {
  loadMembers(inputData: LoadMembersInput): Promise<LoadMembersOutput>;
}
