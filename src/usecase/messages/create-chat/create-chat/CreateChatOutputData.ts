import { Chat } from "@/entity/Chat";
import { User } from "@/entity/User";

export type CreateChatOutputData = {
  chat: Chat;
  chats: (Chat | User)[];
};
