import { Chat } from "@/entity/Chat";

export type NewChatInput = {
  chat_id: string;
  business_id: string;
};

export type NewChatOutput = {
  chats: Chat[];
};

export interface NewChatDataAccessInterface {
  newChat(newChatInput: NewChatInput): Promise<NewChatOutput>;
}
