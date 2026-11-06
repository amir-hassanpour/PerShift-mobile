import { LoadProfilePageViewModel } from "@/interface-adapter/profile/LoadProfilePageViewModel";
import { NewBusinessOutputBoundary } from "@/usecase/main-page/new-business/NewBusinessOutputBoundary";
import { NewBusinessOutputData } from "@/usecase/main-page/new-business/NewBusinesssOutputData";
import { LoadingMainPageViewModel } from "../LoadingMainPageViewModel";
import { NewBusinessState } from "./NewBusinessState";

export class NewBusinessPresenter implements NewBusinessOutputBoundary {
  viewModelProfile: LoadProfilePageViewModel;
  viewModelMainPage: LoadingMainPageViewModel;

  constructor(
    viewModelProfile: LoadProfilePageViewModel,
    viewModelMainPage: LoadingMainPageViewModel,
  ) {
    this.viewModelProfile = viewModelProfile;
    this.viewModelMainPage = viewModelMainPage;
  }

  prepareForSuccessView(output: NewBusinessOutputData): void {
    this.viewModelProfile.businesses = output.busiensses;
    this.viewModelMainPage.businesses = output.busiensses;
    this.viewModelProfile.state = NewBusinessState.SUCCESS;
    this.viewModelMainPage.firePropertyChange();
    this.viewModelProfile.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModelProfile.state = NewBusinessState.FAILURE;
    this.viewModelMainPage.state = NewBusinessState.FAILURE;
    throw new Error(error);
  }
}
