import { LoadingChatPageInputData } from "./LoadingChatPageInputData";

export interface LoadingChatPageInputBoundary {
  laodingChatPage(intputData: LoadingChatPageInputData): Promise<void>;
}
