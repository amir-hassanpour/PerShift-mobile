import { LoadProfilePageInteractor } from "@/usecase/profile/load-profile-page/LoadProfilePageInteractor";

export class LoadProfilePageController {
  interactor: LoadProfilePageInteractor;

  constructor(interactor: LoadProfilePageInteractor) {
    this.interactor = interactor;
  }

  async loadProfilePage(input: {}) {
    await this.interactor.loadProfilePage(input);
  }
}
