import { LoadingMainPageDataAccessInterface } from "./LoadingMainPageDataAccessInterface";
import { LoadingMainPageInputBoundary } from "./LoadingMainPageInputBoundary";
import { LoadingMainPageOutputBoundary } from "./LoadingMainPageOutputBoundary";
import { LoadingMainPageOutputData } from "./LoadingMainPageOutputData";

export class LoadingMainPageInteractor implements LoadingMainPageInputBoundary {
  loadingMPDAO: LoadingMainPageDataAccessInterface;
  loadingMainPageOutputBoundary: LoadingMainPageOutputBoundary;

  constructor(
    loadingMPDAO: LoadingMainPageDataAccessInterface,
    loadingMainPageOutputBoundary: LoadingMainPageOutputBoundary,
  ) {
    this.loadingMPDAO = loadingMPDAO;
    this.loadingMainPageOutputBoundary = loadingMainPageOutputBoundary;
  }

  async loadMainPage(): Promise<void> {
    let loadMainPage = await this.loadingMPDAO.loadMainPage();

    let outputData: LoadingMainPageOutputData = {
      businesses: loadMainPage.businesses,
      shifts: loadMainPage.shifts,
      businessRequested: loadMainPage.businessRequested,
    };
    await this.loadingMainPageOutputBoundary.prepareForSuccessView(outputData);
  }
}
