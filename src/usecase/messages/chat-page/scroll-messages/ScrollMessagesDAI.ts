import { Message } from "@/entity/Message";

export type ScrollMessagesInput = {
  numMessages: number;
  chatID: string;
};

export type ScrollMessagesOutput = {
  messages: Message[];
};

export interface ScrollMessagesDAI {
  scrollMessages(input: ScrollMessagesInput): Promise<ScrollMessagesOutput>;
}
