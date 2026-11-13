import { LoadCreateGroupchatPageInteractor } from "@/usecase/messages/create-chat/load-create-groupchat-page/LoadCreateGroupchatPageInteractor";

export class LoadCreateGroupchatPageController {
  interactor: LoadCreateGroupchatPageInteractor;

  constructor(interactor: LoadCreateGroupchatPageInteractor) {
    this.interactor = interactor;
  }

  async loadCreateGroupchatPage(input: {}): Promise<void> {
    await this.interactor.loadCreateGroupchatPage(input);
  }
}
