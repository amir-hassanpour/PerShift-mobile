import { LoadingChatPageInteractor } from "@/usecase/messages/chat-page/load-chat-page/LoadingChatPageInteractor";

export class LoadingChatPageController {
  interactor: LoadingChatPageInteractor;

  constructor(interactor: LoadingChatPageInteractor) {
    this.interactor = interactor;
  }

  async loadingChatPage(chat_id: { chat_id: string }): Promise<void> {
    await this.interactor.laodingChatPage(chat_id);
  }
}
