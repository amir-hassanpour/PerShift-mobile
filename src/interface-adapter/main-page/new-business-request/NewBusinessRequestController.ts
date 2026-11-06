import { NewBusinessRequestInteractor } from "@/usecase/main-page/new-business-request/NewBusinessRequestInteractor";

export class NewBusinessRequestController {
  interactor: NewBusinessRequestInteractor;

  constructor(interactor: NewBusinessRequestInteractor) {
    this.interactor = interactor;
  }

  async newBusinessRequest(input: { id: string; name: string }) {
    await this.interactor.newBusinessRequested(input);
  }
}
