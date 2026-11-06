import { LoadProfilePageOutputBoundary } from "@/usecase/profile/load-profile-page/LoadProfilePageOutputBoundary";
import { LoadProfilePageOutputData } from "@/usecase/profile/load-profile-page/LoadProfilePageOutputData";
import { LoadProfilePageViewModel } from "../LoadProfilePageViewModel";
import { LoadProfilePageState } from "./LoadProfilePageState";

export class LoadProfilePagePresenter implements LoadProfilePageOutputBoundary {
  viewModel: LoadProfilePageViewModel;

  constructor(viewModel: LoadProfilePageViewModel) {
    this.viewModel = viewModel;
  }

  prepareForSuccessView(outputData: LoadProfilePageOutputData): void {
    this.viewModel.businesses = outputData.businesses;
    this.viewModel.businessesRequested = outputData.businessesRequested;
    this.viewModel.user = outputData.user;
    this.viewModel.state = LoadProfilePageState.SUCCESS;
    this.viewModel.firePropertyChange();
  }
  prepareForFailureVuew(error: string): void {
    this.viewModel.state = LoadProfilePageState.FAILURE;
    throw new Error(error);
  }
}
