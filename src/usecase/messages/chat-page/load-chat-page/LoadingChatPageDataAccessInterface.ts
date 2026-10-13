import { Message } from "@/entity/Message";

export type loadingChatPageOutput = {
  messages: Message[];
};

export type loadingChatPageInput = {
  chat_id: string;
};

export interface LoadingChatPageDataAccessInterface {
  loadingChatPage(): Promise<loadingChatPageOutput>;
}
