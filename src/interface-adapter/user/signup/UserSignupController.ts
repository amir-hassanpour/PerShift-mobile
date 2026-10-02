import { UserSignupInteractor } from "@/usecase/user/user-signup/UserSignupInteractor";

export class UserSignupController {
  userSignupInteractor: UserSignupInteractor;

  constructor(userSignupInteractor: UserSignupInteractor) {
    this.userSignupInteractor = userSignupInteractor;
  }

  async signupUser(
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string,
    confirmPassword: String,
  ) {
    await this.userSignupInteractor.signupUser({
      firstName: first_name,
      lastName: last_name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      username: username,
    });
  }
}
