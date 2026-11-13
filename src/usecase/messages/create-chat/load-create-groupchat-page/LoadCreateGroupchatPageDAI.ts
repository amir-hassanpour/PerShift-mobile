import { User } from "@/entity/User";

export type LoadCreateGroupchatPageInput = {};

export type LoadCreateGroupchatPageOutput = {
  users: User[];
  businessID: string;
};

export interface LoadCreateGroupchatPageDAI {
  loadCreateGroupchatPage(
    input: LoadCreateGroupchatPageInput,
  ): Promise<LoadCreateGroupchatPageOutput>;
}
