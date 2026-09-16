import { UserSignupDataAccessObject } from "@/data-access/user-data/UserSignupDataAccessObject";
import { UserSignupController } from "@/interface-adapter/user/signup/UserSignupController";
import { UserSignupPresenter } from "@/interface-adapter/user/signup/UserSignupPresenter";
import { UserSignupState } from "@/interface-adapter/user/signup/UserSignupState";
import { UserSignupViewModel } from "@/interface-adapter/user/signup/UserSignupViewModel";
import { UserSignupDataAccessInterface } from "@/usecase/user/user-signup/UserSignupDataAccessInterface";
import { UserSignupInteractor } from "@/usecase/user/user-signup/UserSignupInteractor";
import { UserSignupOutputBoundary } from "@/usecase/user/user-signup/UserSignupOutputBoundary";
import { SignupView } from "@/view/user/signup/SignupView";
import { ReactElement } from "react";

export default class Builder {
  userSignupInteractor: UserSignupInteractor | undefined = undefined;
  userSignupOutputBoundary: UserSignupOutputBoundary | undefined = undefined;
  userSignupDAO: UserSignupDataAccessInterface | undefined = undefined;
  userSignupViewModel: UserSignupViewModel | undefined = undefined;
  userSignupController: UserSignupController | undefined = undefined;
  signupView: SignupView | undefined = undefined;

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
    this.signupView = new SignupView({
      userSignupController: this.userSignupController,
      userSignupViewModel: this.userSignupViewModel,
    });

    return (
      <SignupView
        userSignupController={this.userSignupController}
        userSignupViewModel={this.userSignupViewModel}
      />
    );
  }
}
