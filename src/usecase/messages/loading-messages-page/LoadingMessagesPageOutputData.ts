import { Chat } from "@/entity/Chat";

export type LoadingMessagesPageOutputData = {
  chats: Chat[];
  user_id: string;
};
