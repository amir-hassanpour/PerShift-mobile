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
    for (const shift of output.shifts) {
      let exists = false;
      for (const shiftViewModel of this.viewModelMainPage.shifts) {
        if (shift.shiftID === shiftViewModel.shiftID) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        this.viewModelMainPage.shifts.push(shift);
      }
    }
    this.viewModelMainPage.shifts.sort(
      (a, b) =>
        a.startTime.getTime() - b.startTime.getTime() ||
        a.shiftID.localeCompare(b.shiftID),
    );
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
