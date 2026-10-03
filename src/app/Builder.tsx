import { BussinessDataAccessObject } from "@/data-access/business-data/BusinessDataAccessObject";
import { UserSignupDataAccessObject } from "@/data-access/user-data/UserSignupDataAccessObject";
import { LoadingMainPageController } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageController";
import { LoadingMainPagePresenter } from "@/interface-adapter/main-page/load-main-page/LoadingMainPagePresenter";
import { LoadingMainPageStates } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageState";
import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageViewModel";
import { UserSignupController } from "@/interface-adapter/user/signup/UserSignupController";
import { UserSignupPresenter } from "@/interface-adapter/user/signup/UserSignupPresenter";
import { UserSignupState } from "@/interface-adapter/user/signup/UserSignupState";
import { UserSignupViewModel } from "@/interface-adapter/user/signup/UserSignupViewModel";
import { LoadingMainPageDataAccessInterface } from "@/usecase/main-page/loading-main-page/LoadingMainPageDataAccessInterface";
import { LoadingMainPageInteractor } from "@/usecase/main-page/loading-main-page/LoadingMainPageInteractor";
import { LoadingMainPageOutputBoundary } from "@/usecase/main-page/loading-main-page/LoadingMainPageOutputBoundary";
import { UserSignupDataAccessInterface } from "@/usecase/user/user-signup/UserSignupDataAccessInterface";
import { UserSignupInteractor } from "@/usecase/user/user-signup/UserSignupInteractor";
import { UserSignupOutputBoundary } from "@/usecase/user/user-signup/UserSignupOutputBoundary";
import { MainPageView } from "@/view/main-page/MainPageView";
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
  loadingMainPageViewModel: LoadingMainPageViewModel | undefined = undefined;
  laodingMainPageController: LoadingMainPageController | undefined = undefined;
  mainPageView: MainPageView | undefined = undefined;

  makeMainPageView(): ReactElement {
    this.loadingMainPageViewModel = new LoadingMainPageViewModel(
      LoadingMainPageStates.SUCCESS,
    );
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
      />
    );
  }

  makeSignupView(): ReactElement {
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

    return (
      <SignupView
        userSignupController={this.userSignupController}
        userSignupViewModel={this.userSignupViewModel}
        buildMainPage={() => this.makeMainPageView()}
      />
    );
  }
}
