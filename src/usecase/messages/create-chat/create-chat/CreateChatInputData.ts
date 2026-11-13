import { User } from "@/entity/User";

export type CreateChatInputData = {
  isGroupChat: boolean;
  name: string;
  users: User[];
  businessID: string;
};
