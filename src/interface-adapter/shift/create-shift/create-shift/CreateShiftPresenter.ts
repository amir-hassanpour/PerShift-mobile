import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/LoadingMainPageViewModel";
import { CreateShiftOutputBoundary } from "@/usecase/shift/create-shift/create-shift/CreateShiftOuputBoundary";
import { CreateShiftOutputData } from "@/usecase/shift/create-shift/create-shift/CreateShiftOutputData";
import { LoadCreateShiftPageViewModel } from "../LoadCreateShiftPageViewModel";
import { CreateShiftState } from "./CreateShiftState";

export class CreateShiftPresenter implements CreateShiftOutputBoundary {
  viewModelMainPage: LoadingMainPageViewModel;
  viewModelCreateShift: LoadCreateShiftPageViewModel;

  constructor(
    viewModelMainPage: LoadingMainPageViewModel,
    viewModelCreateShift: LoadCreateShiftPageViewModel,
  ) {
    this.viewModelMainPage = viewModelMainPage;
    this.viewModelCreateShift = viewModelCreateShift;
  }
  prepareForStartTimeMissingView(): void {
    this.viewModelCreateShift.state = CreateShiftState.START_TIME_MISSING;
    this.viewModelCreateShift.firePropertyChange();
  }
  prepareForEndTimeMissingVlaue(): void {
    this.viewModelCreateShift.state = CreateShiftState.END_TIME_MISSING;
    this.viewModelCreateShift.firePropertyChange();
  }
  prepareForInvalidTimeView(): void {
    this.viewModelCreateShift.state = CreateShiftState.TIME_INVALID;
    this.viewModelCreateShift.firePropertyChange();
  }

  prepareForSuccessView(output: CreateShiftOutputData): void {
    this.viewModelMainPage.shifts = output.shifts;
    this.viewModelMainPage.state = CreateShiftState.SUCCESS;
    this.viewModelCreateShift.state = CreateShiftState.SUCCESS;
    this.viewModelMainPage.firePropertyChange();
    this.viewModelCreateShift.firePropertyChange();
    this.viewModelCreateShift.state = CreateShiftState.IDLE;
  }

  prepareForFailureView(error: string): void {
    this.viewModelCreateShift.state = CreateShiftState.FAILURE;
    this.viewModelCreateShift.firePropertyChange();
  }
}
