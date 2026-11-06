import { User } from "@/entity/User";

export type NewMemberInputData = {
  member: User;
};

export type NewMemberOutputData = {
  members: User[];
};

export interface NewMemberDataAccessInterface {
  newMember(inputData: NewMemberInputData): Promise<NewMemberOutputData>;
}
