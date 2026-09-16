import { UserSignupDataAccessInterface } from "./UserSignupDataAccessInterface";
import { UserSignupInputBoundary } from "./UserSignupInputBoundary";
import { UserSignupInputData } from "./UserSignupInputData";
import { UserSignupOutputBoundary } from "./UserSignupOutputBoundary";

export class UserSignupInteractor implements UserSignupInputBoundary {
  userSignupDAO: UserSignupDataAccessInterface;
  userSignupOutputBoundary: UserSignupOutputBoundary;

  constructor(
    userSignupDAO: UserSignupDataAccessInterface,
    userSignupOutputBoundary: UserSignupOutputBoundary,
  ) {
    this.userSignupDAO = userSignupDAO;
    this.userSignupOutputBoundary = userSignupOutputBoundary;
  }

  async signupUser(input: UserSignupInputData): Promise<void> {
    try {
      await this.userSignupDAO.validateSignupInput(input);

      await this.userSignupDAO.storeSignupInformation(input);

      await this.userSignupOutputBoundary.prepareForSuccessView({
        success: true,
        message: "Check your email to confirm your account",
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof error.code === "string"
      ) {
        await this.userSignupOutputBoundary.prepareForFailureView(error.code);

        return;
      }

      await this.userSignupOutputBoundary.prepareForFailureView(
        "SIGNUP_FAILED",
      );
    }
  }
}
