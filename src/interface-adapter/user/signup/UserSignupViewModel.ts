import { UserSignupState } from "./UserSignupState";

export class UserSignupViewModel {
  state: UserSignupState;

  constructor(state: UserSignupState) {
    this.state = state;
  }
}
