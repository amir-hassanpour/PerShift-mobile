import { NewBusinessInteractor } from "@/usecase/main-page/new-business/NewBusinessInteractor";

export class NewBusinessController {
  interactor: NewBusinessInteractor;

  constructor(interactor: NewBusinessInteractor) {
    this.interactor = interactor;
  }

  async newBusiness(input: { id: string; name: string; lastCheckedIn: Date }) {
    await this.interactor.newBusiness(input);
  }
}
