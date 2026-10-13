import { NewChatInputData } from "./NewChatInputData";

export interface NewChatInputBoundary {
  newChat(inputData: NewChatInputData): Promise<void>;
}
