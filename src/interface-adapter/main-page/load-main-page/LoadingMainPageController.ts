import { LoadingMainPageInteractor } from "@/usecase/main-page/loading-main-page/LoadingMainPageInteractor";

export class LoadingMainPageController {
  loadingMainPageInteractor: LoadingMainPageInteractor;

  constructor(loadMainPageInteractor: LoadingMainPageInteractor) {
    this.loadingMainPageInteractor = loadMainPageInteractor;
  }

  async loadMainPage() {
    await this.loadingMainPageInteractor.loadMainPage();
  }
}
