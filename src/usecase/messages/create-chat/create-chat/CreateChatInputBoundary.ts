import { CreateChatInputData } from "./CreateChatInputData";

export interface CreateChatInputBoundary {
  createChat(input: CreateChatInputData): void;
}
