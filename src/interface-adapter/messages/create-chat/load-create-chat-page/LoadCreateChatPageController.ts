import { LoadCreateChatPageInteractor } from "@/usecase/messages/create-chat/load-create-chat-page/LoadCreateChatPageInteractor";

export class LoadCreateChatPageController {
  interactor: LoadCreateChatPageInteractor;

  constructor(interactor: LoadCreateChatPageInteractor) {
    this.interactor = interactor;
  }

  async loadCreateChatPage(input: {}) {
    await this.interactor.loadCreateChatPage({});
  }
}
