import { Chat } from "@/entity/Chat";
import { User } from "@/entity/User";

export type ChatExistsInput = {
  user: User;
};

export type ChatExistsOutput = {
  chat: Chat | null;
};

export interface ChatExistsDAI {
  chatEsists(input: ChatExistsInput): Promise<ChatExistsOutput>;
}
