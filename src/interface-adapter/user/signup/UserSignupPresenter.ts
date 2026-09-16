import { UserSignupOutputBoundary } from "@/usecase/user/user-signup/UserSignupOutputBoundary";
import { UserSignupOutputData } from "@/usecase/user/user-signup/UserSignupOutputData";
import { UserSignupState } from "./UserSignupState";
import { UserSignupViewModel } from "./UserSignupViewModel";

export class UserSignupPresenter implements UserSignupOutputBoundary {
  viewModel: UserSignupViewModel;

  constructor(viewModel: UserSignupViewModel) {
    this.viewModel = viewModel;
  }

  async prepareForSuccessView(outputData: UserSignupOutputData): Promise<void> {
    this.viewModel.state = UserSignupState.SUCCESS;
  }

  async prepareForFailureView(error: string): Promise<void> {
    const curState = Object.values(UserSignupState).find(
      (status) => status === error,
    );

    this.viewModel.state =
      curState !== undefined ? curState : UserSignupState.SIGNUP_FAILED;
  }
}
