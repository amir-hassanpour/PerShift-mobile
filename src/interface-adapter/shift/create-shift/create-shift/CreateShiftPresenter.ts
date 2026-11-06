import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/LoadingMainPageViewModel";
import { CreateShiftOutputBoundary } from "@/usecase/shift/create-shift/create-shift/CreateShiftOuputBoundary";
import { CreateShiftOutputData } from "@/usecase/shift/create-shift/create-shift/CreateShiftOutputData";
import { CreateShiftState } from "./CreateShiftState";

export class CreateShiftPresenter implements CreateShiftOutputBoundary {
  viewModelMainPage: LoadingMainPageViewModel;

  constructor(viewModelMainPage: LoadingMainPageViewModel) {
    this.viewModelMainPage = viewModelMainPage;
  }

  prepareForSuccessView(output: CreateShiftOutputData): void {
    this.viewModelMainPage.shifts = output.shifts;
    this.viewModelMainPage.state = CreateShiftState.SUCCESS;
    this.viewModelMainPage.firePropertyChange();
  }

  prepareForFailureView(error: string): void {
    this.viewModelMainPage.state = CreateShiftState.FAILURE;
    throw new Error(error);
  }
}
