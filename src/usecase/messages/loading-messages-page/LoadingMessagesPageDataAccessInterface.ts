import { Chat } from "@/entity/Chat";

export type ChatsOutput = {
  chats: Chat[];
  user_id: string;
};

export interface LoadingMessagesPageDataAccessInterface {
  loadMainPage(): Promise<ChatsOutput>;
}
