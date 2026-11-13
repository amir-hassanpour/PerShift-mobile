import { ChatExistsInputData } from "./ChatExistsInputData";

export interface ChatExistsInputBoundary {
  chatExists(input: ChatExistsInputData): void;
}
