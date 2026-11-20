import { ScrollChatsInteractor } from "@/usecase/messages/scroll-chats/ScrollChatsInteractor";

export class ScrollChatsController {
  interactor: ScrollChatsInteractor;

  constructor(interactor: ScrollChatsInteractor) {
    this.interactor = interactor;
  }

  async scrolleView(input: { numChats: number }) {
    await this.interactor.scrollChats(input);
  }
}
