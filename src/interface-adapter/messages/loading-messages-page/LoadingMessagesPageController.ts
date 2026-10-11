import { LoadingMessagesPageInteractor } from "@/usecase/loading-messages-page/LoadingMessagesPageInteractor";

export class LoadingMessagesPageController {
  interactor: LoadingMessagesPageInteractor;

  constructor(interactor: LoadingMessagesPageInteractor) {
    this.interactor = interactor;
  }

  async loadMainPageController() {
    await this.interactor.loadMessagesPage({});
  }
}
