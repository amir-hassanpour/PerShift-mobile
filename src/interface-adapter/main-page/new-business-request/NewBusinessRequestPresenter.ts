import { LoadProfilePageViewModel } from "@/interface-adapter/profile/LoadProfilePageViewModel";
import { NewBusinessRequestOutputBoundary } from "@/usecase/main-page/new-business-request/NewBusinessRequestOutputBoundary";
import { NewBusinessRequestOutputData } from "@/usecase/main-page/new-business-request/NewBusinessRequestOutputData";
import { LoadingMainPageViewModel } from "../LoadingMainPageViewModel";
import { NewBusinessRequestState } from "./NewBusinessRequestState";

export class NewBusinessRequestPresenter implements NewBusinessRequestOutputBoundary {
  viewModelProfile: LoadProfilePageViewModel;
  viewModelMainPage: LoadingMainPageViewModel;

  constructor(
    viewModelProfile: LoadProfilePageViewModel,
    viewModelMainPage: LoadingMainPageViewModel,
  ) {
    this.viewModelMainPage = viewModelMainPage;
    this.viewModelProfile = viewModelProfile;
  }

  prepareForSuccesView(output: NewBusinessRequestOutputData): void {
    this.viewModelMainPage.businessRequested = output.businessesRequested;
    this.viewModelProfile.businessesRequested = output.businessesRequested;
    this.viewModelMainPage.state = NewBusinessRequestState.SUCCUESS;
    this.viewModelProfile.state = NewBusinessRequestState.SUCCUESS;
    this.viewModelMainPage.firePropertyChange();
    this.viewModelProfile.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModelMainPage.state = NewBusinessRequestState.FAILURE;
    this.viewModelProfile.state = NewBusinessRequestState.FAILURE;
    throw new Error(error);
  }
}
