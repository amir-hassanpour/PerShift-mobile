import { supabase } from "@/data-access/supabase/client";
import { User } from "@/entity/User";
import { UserSignupDataAccessInterface } from "@/usecase/user/user-signup/UserSignupDataAccessInterface";
import { UserSignupInputData } from "@/usecase/user/user-signup/UserSignupInputData";
import { UserRAMDisk } from "./UserRAMDisk";

export type SignUpUserResult = {
  user: User;
  requiresEmailConfirmation: boolean;
};

export type UserSignUpErrorCode =
  | "FIRST_NAME_REQUIRED"
  | "LAST_NAME_REQUIRED"
  | "USERNAME_REQUIRED"
  | "USERNAME_TOO_SHORT"
  | "EMAIL_REQUIRED"
  | "INVALID_EMAIL"
  | "PASSWORD_REQUIRED"
  | "WEAK_PASSWORD"
  | "EMAIL_ALREADY_EXISTS"
  | "USERNAME_ALREADY_EXISTS"
  | "SIGNUP_FAILED"
  | "PASSWORDS_DO_NOT_MATCH";

export class UserSignUpError extends Error {
  constructor(
    public readonly code: UserSignUpErrorCode,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "UserSignUpError";
  }
}

export class UserSignupDataAccessObject implements UserSignupDataAccessInterface {
  private readonly userRAM = new UserRAMDisk();

  async validateSignupInput(input: UserSignupInputData): Promise<void> {
    if (!input.firstName.trim()) {
      throw new UserSignUpError(
        "FIRST_NAME_REQUIRED",
        "First name is required",
      );
    }

    if (!input.lastName.trim()) {
      throw new UserSignUpError("LAST_NAME_REQUIRED", "Last name is required");
    }

    if (!input.username.trim()) {
      throw new UserSignUpError("USERNAME_REQUIRED", "Username is required");
    }

    if (input.username.trim().length < 3) {
      throw new UserSignUpError(
        "USERNAME_TOO_SHORT",
        "Username must contain at least 3 characters",
      );
    }

    const email = input.email.trim().toLowerCase();

    if (!email) {
      throw new UserSignUpError("EMAIL_REQUIRED", "Email is required");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      throw new UserSignUpError("INVALID_EMAIL", "Enter a valid email address");
    }

    if (!input.password) {
      throw new UserSignUpError("PASSWORD_REQUIRED", "Password is required");
    }

    if (input.password.trim != input.confirmPassword.trim) {
      throw new UserSignUpError(
        "PASSWORDS_DO_NOT_MATCH",
        "Passwords not matching",
      );
    }
  }

  async storeSignupInformation(input: UserSignupInputData): Promise<void> {
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    const username = input.username.trim().toLowerCase();
    const email = input.email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: input.password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          username,
        },
      },
    });

    if (error) {
      console.log(error.status, error.name, error.message);
      switch (error.code) {
        case "email_address_invalid":
          throw new UserSignUpError(
            "INVALID_EMAIL",
            "Enter a valid email address",
            error.status,
          );

        case "weak_password":
          throw new UserSignUpError(
            "WEAK_PASSWORD",
            "The password is not strong enough",
            error.status,
          );

        case "email_exists":
          throw new UserSignUpError(
            "EMAIL_ALREADY_EXISTS",
            "An account is using this email",
            error.status,
          );

        case "user_already_exists":
          throw new UserSignUpError(
            "EMAIL_ALREADY_EXISTS",
            "An account already uses this email",
            error.status,
          );

        default:
          throw new UserSignUpError(
            "SIGNUP_FAILED",
            error.message,
            error.status,
          );
      }
    }

    if (!data.user) {
      throw new UserSignUpError(
        "SIGNUP_FAILED",
        "Supabase did not create the user",
      );
    }

    const createdUser = new User({
      id: data.user.id,
      firstName,
      lastName,
      username,
      email,
      createdAt: new Date(data.user.created_at),
    });

    await this.userRAM.saveCurrentUser(createdUser);
  }
}
