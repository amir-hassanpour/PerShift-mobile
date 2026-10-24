import { SendMessageInputData } from "./SendMessageInputData";

export interface SendMessageInputBoundary {
  sendMessage(inputData: SendMessageInputData): Promise<void>;
}
