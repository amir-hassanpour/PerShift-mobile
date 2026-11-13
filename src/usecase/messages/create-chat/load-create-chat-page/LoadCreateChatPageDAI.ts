import { Chat } from "@/entity/Chat";
import { User } from "@/entity/User";

export type LoadCreateChatInput = {};

export type LoadCreateChatOutput = {
  users: User[];
  chats: Chat[];
  businessID: string;
};

export interface LoadCreateChatPageDAI {
  loadCreateChatPage(input: LoadCreateChatInput): Promise<LoadCreateChatOutput>;
}
