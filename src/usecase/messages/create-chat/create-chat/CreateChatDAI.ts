import { Chat } from "@/entity/Chat";
import { User } from "@/entity/User";

export type CreateChatInput = {
  isGroupChat: boolean;
  chat: Chat;
  users: User[];
};

export type CreateChatOutput = {
  chats: (Chat | User)[];
};

export interface CreateChatDAI {
  createChat(input: CreateChatInput): Promise<CreateChatOutput>;
}
