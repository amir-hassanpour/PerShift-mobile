import { Chat } from "@/entity/Chat";

export type ChatsOutput = {
  chats: Chat[];
};

export interface LoadingMessagesPageDataAccessInterface {
  loadMainPage(): Promise<ChatsOutput>;
}
