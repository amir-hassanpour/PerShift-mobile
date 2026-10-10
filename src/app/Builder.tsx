import { BussinessDataAccessObject } from "@/data-access/business-data/BusinessDataAccessObject";
import { BusinessShiftsRAMDisk } from "@/data-access/business-data/shift/BusinessShiftsRAMDisk";
import { UserSignupDataAccessObject } from "@/data-access/user-data/UserSignupDataAccessObject";
import { AcceptBusinessRequestController } from "@/interface-adapter/main-page/accept-business-request/AcceptBusinessRequestController";
import { AcceptBusinessRequestPresenter } from "@/interface-adapter/main-page/accept-business-request/AcceptBusinessRequestPresenter";
import { DeclineBusinessRequestController } from "@/interface-adapter/main-page/decline-business-request/DeclineBusinessRequestController";
import { DeclineBusinessRequestPresenter } from "@/interface-adapter/main-page/decline-business-request/DeclineBusinessRequestPresenter";
import { LoadingMainPageController } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageController";
import { LoadingMainPagePresenter } from "@/interface-adapter/main-page/load-main-page/LoadingMainPagePresenter";
import { LoadingMainPageStates } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageState";
import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/LoadingMainPageViewModel";
import { NewShiftController } from "@/interface-adapter/shift/new-shift/NewShiftController";
import { NewShiftPresenter } from "@/interface-adapter/shift/new-shift/NewShiftPresenter";
import { UserSignupController } from "@/interface-adapter/user/signup/UserSignupController";
import { UserSignupPresenter } from "@/interface-adapter/user/signup/UserSignupPresenter";
import { UserSignupState } from "@/interface-adapter/user/signup/UserSignupState";
import { UserSignupViewModel } from "@/interface-adapter/user/signup/UserSignupViewModel";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { ShiftDataBaseSubscribe } from "@/realtime/ShiftDataBaseSubsribe";
import { AcceptBusinessRequestDataAccessInterface } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestDataAccessInterface";
import { AcceptBusinessRequestInteractor } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestInteractor";
import { AcceptBusinessRequestOutputBoundary } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestOutputBoundary";
import { DeclineBusinessRequestDataAccessInterface } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestDataAccessInterface";
import { DeclineBusinessRequestInteractor } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestInteractor";
import { DeclineBusinessRequestOutputBoundary } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestOutputBoundary";
import { LoadingMainPageDataAccessInterface } from "@/usecase/main-page/loading-main-page/LoadingMainPageDataAccessInterface";
import { LoadingMainPageInteractor } from "@/usecase/main-page/loading-main-page/LoadingMainPageInteractor";
import { LoadingMainPageOutputBoundary } from "@/usecase/main-page/loading-main-page/LoadingMainPageOutputBoundary";
import { NewShiftInteractor } from "@/usecase/shift/new-shift/NewShiftInteractor";
import { UserSignupDataAccessInterface } from "@/usecase/user/user-signup/UserSignupDataAccessInterface";
import { UserSignupInteractor } from "@/usecase/user/user-signup/UserSignupInteractor";
import { UserSignupOutputBoundary } from "@/usecase/user/user-signup/UserSignupOutputBoundary";
import { MainPageView } from "@/view/main-page/MainPageView";
import { MainPageSlidingNavigation } from "@/view/MainPageSlidingNavigation";
import { Messages } from "@/view/messages/Messages";
import { NavigationBar } from "@/view/navigation-bar/NavigationBar";
import { SignupView } from "@/view/user/signup/SignupView";
import { ReactElement } from "react";

export default class Builder {
  userSignupInteractor: UserSignupInteractor | undefined = undefined;
  userSignupOutputBoundary: UserSignupOutputBoundary | undefined = undefined;
  userSignupDAO: UserSignupDataAccessInterface | undefined = undefined;
  userSignupViewModel: UserSignupViewModel | undefined = undefined;
  userSignupController: UserSignupController | undefined = undefined;
  signupView: SignupView | undefined = undefined;

  laodingMainPageInteractor: LoadingMainPageInteractor | undefined = undefined;
  loadingMainPageOutputBoudnary: LoadingMainPageOutputBoundary | undefined =
    undefined;
  loadingMainPageDAO: LoadingMainPageDataAccessInterface | undefined =
    undefined;
  loadingMainPageViewModel = new LoadingMainPageViewModel(
    LoadingMainPageStates.IDLE,
  );
  laodingMainPageController: LoadingMainPageController | undefined = undefined;
  mainPageView: MainPageView | undefined = undefined;

  declineBusinessRequestInteractor:
    | DeclineBusinessRequestInteractor
    | undefined = undefined;
  declineBusinessRequestOutputBoundary:
    | DeclineBusinessRequestOutputBoundary
    | undefined = undefined;
  declineBusinessRequestDAO:
    | DeclineBusinessRequestDataAccessInterface
    | undefined = undefined;
  declineBusinessRequestController:
    | DeclineBusinessRequestController
    | undefined = undefined;

  acceptBusinessRequestInteractor: AcceptBusinessRequestInteractor | undefined =
    undefined;
  acceptBusinessRequestOutputBoundary:
    | AcceptBusinessRequestOutputBoundary
    | undefined = undefined;
  acceptBusinessRequestDAO:
    | AcceptBusinessRequestDataAccessInterface
    | undefined = undefined;
  acceptBusinessRequestController: AcceptBusinessRequestController | undefined =
    undefined;

  newShiftController: NewShiftController | undefined = undefined;
  newShiftInteractor: NewShiftInteractor | undefined = undefined;
  newShiftPresenter: NewShiftPresenter | undefined = undefined;
  businessRAMDisk: BusinessShiftsRAMDisk | undefined = undefined;

  makeMainPageSlider(showScreen: (screen: ReactElement) => void): ReactElement {
    return (
      <MainPageSlidingNavigation
        pages={[
          this.makeMainPageView(showScreen),
          this.makeMessagesPage(showScreen),
        ]}
        renderNavigation={({ onSelect }) => this.makeNavigationBar(onSelect)}
      />
    );
  }

  makeMessagesPage(showScreen: (screen: ReactElement) => void): ReactElement {
    return <Messages viewModel={new ViewModel()} />;
  }

  makeNavigationBar(
    onSelect: (index: 0 | 1 | 2 | 3 | 4 | 5) => void,
  ): ReactElement {
    return (
      <NavigationBar
        onMessagesPress={() => {
          onSelect(1);
        }}
        onMainPress={() => {
          onSelect(0);
        }}
      />
    );
  }

  subscribeToRoleAssignmentRealTime(): ShiftDataBaseSubscribe {
    this.businessRAMDisk = new BusinessShiftsRAMDisk();

    this.newShiftPresenter = new NewShiftPresenter(
      this.loadingMainPageViewModel,
    );

    this.newShiftInteractor = new NewShiftInteractor(
      this.newShiftPresenter,
      this.businessRAMDisk,
    );
    this.newShiftController = new NewShiftController(this.newShiftInteractor);

    return new ShiftDataBaseSubscribe({ controller: this.newShiftController });
  }

  makeAcceptBusinessRequestUsecase(): AcceptBusinessRequestController {
    if (!this.loadingMainPageViewModel) {
      this.acceptBusinessRequestOutputBoundary =
        new AcceptBusinessRequestPresenter(
          new LoadingMainPageViewModel(LoadingMainPageStates.IDLE),
        );
    } else {
      this.acceptBusinessRequestOutputBoundary =
        new AcceptBusinessRequestPresenter(this.loadingMainPageViewModel);
    }

    this.acceptBusinessRequestDAO = new BussinessDataAccessObject();
    this.acceptBusinessRequestInteractor = new AcceptBusinessRequestInteractor(
      this.acceptBusinessRequestOutputBoundary,
      this.acceptBusinessRequestDAO,
    );
    this.acceptBusinessRequestController = new AcceptBusinessRequestController(
      this.acceptBusinessRequestInteractor,
    );

    return this.acceptBusinessRequestController;
  }

  makeDeclineBusinessRequestUsecase(): DeclineBusinessRequestController {
    if (!this.loadingMainPageViewModel) {
      this.declineBusinessRequestOutputBoundary =
        new DeclineBusinessRequestPresenter(
          new LoadingMainPageViewModel(LoadingMainPageStates.IDLE),
        );
    } else {
      this.declineBusinessRequestOutputBoundary =
        new DeclineBusinessRequestPresenter(this.loadingMainPageViewModel);
    }

    this.declineBusinessRequestDAO = new BussinessDataAccessObject();
    this.declineBusinessRequestInteractor =
      new DeclineBusinessRequestInteractor(
        this.declineBusinessRequestOutputBoundary,
        this.declineBusinessRequestDAO,
      );
    this.declineBusinessRequestController =
      new DeclineBusinessRequestController(
        this.declineBusinessRequestInteractor,
      );

    return this.declineBusinessRequestController;
  }

  makeMainPageView(showScreen: (screen: ReactElement) => void): ReactElement {
    this.loadingMainPageOutputBoudnary = new LoadingMainPagePresenter(
      this.loadingMainPageViewModel,
    );
    this.loadingMainPageDAO = new BussinessDataAccessObject();
    this.laodingMainPageInteractor = new LoadingMainPageInteractor(
      this.loadingMainPageDAO,
      this.loadingMainPageOutputBoudnary,
    );
    this.laodingMainPageController = new LoadingMainPageController(
      this.laodingMainPageInteractor,
    );

    return (
      <MainPageView
        controller={this.laodingMainPageController}
        viewModel={this.loadingMainPageViewModel}
        declineBusinessRequestController={this.makeDeclineBusinessRequestUsecase()}
        acceptBusinessRequestController={this.makeAcceptBusinessRequestUsecase()}
      />
    );
  }

  makeSignupView(showScreen: (screen: ReactElement) => void): ReactElement {
    this.userSignupViewModel = new UserSignupViewModel(UserSignupState.IDLE);
    this.userSignupOutputBoundary = new UserSignupPresenter(
      this.userSignupViewModel,
    );
    this.userSignupDAO = new UserSignupDataAccessObject();
    this.userSignupInteractor = new UserSignupInteractor(
      this.userSignupDAO,
      this.userSignupOutputBoundary,
    );
    this.userSignupController = new UserSignupController(
      this.userSignupInteractor,
    );

    let makeMainPage = async () => await this.makeMainPageView(showScreen);

    return (
      <SignupView
        userSignupController={this.userSignupController}
        userSignupViewModel={this.userSignupViewModel}
        buildMainPage={this.makeMainPageView(showScreen)}
      />
    );
  }
}
