import { UserSignupInputData } from "./UserSignupInputData";

export interface UserSignupInputBoundary {
  signupUser(inputData: UserSignupInputData): Promise<void>;
}
