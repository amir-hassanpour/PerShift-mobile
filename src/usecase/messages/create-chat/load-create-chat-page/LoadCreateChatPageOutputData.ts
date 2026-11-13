import { Chat } from "@/entity/Chat";
import { User } from "@/entity/User";

export type LoadCreateChatPageOutputData = {
  users: User[];
  chats: Chat[];
  businessID: string;
};
