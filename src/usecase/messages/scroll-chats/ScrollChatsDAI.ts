import { Chat } from "@/entity/Chat";

export type ScrollChatsInput = {
  numChats: number;
};

export type ScrollChatsOutput = {
  chats: Chat[];
};

export interface ScrollChatsDAI {
  scrollChats(input: ScrollChatsInput): Promise<ScrollChatsOutput>;
}
