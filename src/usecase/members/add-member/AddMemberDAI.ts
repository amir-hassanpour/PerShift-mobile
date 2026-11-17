import { Role } from "@/entity/Role";

export interface AddMemberDAI {
  addMember(input: AddMemberInput): Promise<AddMemberOutput>;
}

export type AddMemberInput = {
  email: string;
  role: Role;
};

export type AddMemberOutput = {};
