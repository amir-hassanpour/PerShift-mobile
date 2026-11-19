import { Role } from "@/entity/Role";
import { User } from "@/entity/User";

export type LoadMembersPageOutputData = {
  members: User[];
  canAddMembers: boolean;
  roles: Role[];
};
