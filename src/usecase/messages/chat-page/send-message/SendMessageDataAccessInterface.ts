import { Message } from "@/entity/Message";

export type OutputData = {
  messages: Message[];
};

export interface SendMessageDataAccessInterface {
  sendMessage(inputData: Message): Promise<OutputData>;
}
