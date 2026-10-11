import { LoadingMessagesPageInputData } from "./LoadingMessagesPageInputData";

export interface LoadingMessagesPageInputBoudnary {
  loadMessagesPage(inputData: LoadingMessagesPageInputData): Promise<void>;
}
