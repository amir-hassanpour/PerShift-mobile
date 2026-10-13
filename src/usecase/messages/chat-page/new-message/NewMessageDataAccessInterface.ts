import { Message } from "@/entity/Message";

export type NewMessageOutput = {
  messages: Message[];
};

export type NewMessageInput = {
  id: string;
  chat_id: string;
  content: string;
  time: Date;
  sender_id: string;
};

export interface NewMessageDataAccessInterface {
  newMessage(message: NewMessageInput): Promise<NewMessageOutput>;
}
