import { DeleteChatInputData } from "./DeleteChatInputData";

export interface DeleteChatInputBoundary {
  deleteChat(input: DeleteChatInputData): void;
}
