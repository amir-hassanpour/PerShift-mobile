import { User } from "@/entity/User";

export type ScrollMembersInput = {
  numMembers: number;
};

export type ScrollMembersOutput = {
  members: User[];
};

export interface ScrollMembersDAI {
  scrollMembers(input: ScrollMembersInput): Promise<ScrollMembersOutput>;
}
