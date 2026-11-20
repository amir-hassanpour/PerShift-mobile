import { ScrollMessagesInteractor } from "@/usecase/messages/chat-page/scroll-messages/ScrollMessagesInteractor";

export class ScrollMessagesController {
  interactor: ScrollMessagesInteractor;

  constructor(interactor: ScrollMessagesInteractor) {
    this.interactor = interactor;
  }

  async scrollMessages(input: { numMessages: number; chatID: string }) {
    await this.interactor.scrollMessages(input);
  }
}
