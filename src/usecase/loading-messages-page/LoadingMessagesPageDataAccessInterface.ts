import { Chat } from "@/entity/Chat";

export type ChatsOutput = {
  chats: Chat[];
};

export interface LoadingMainPageDataAccessInterface {
  loadMainPage(): Promise<ChatsOutput>;
}
