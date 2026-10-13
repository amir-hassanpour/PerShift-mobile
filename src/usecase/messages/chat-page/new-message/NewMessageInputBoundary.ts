import { NewMessageInputData } from "./NewMessageInputData";

export interface NewMessageInputBoundary {
  newMessage(inputData: NewMessageInputData): Promise<void>;
}
