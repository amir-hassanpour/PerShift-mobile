import { UserSignupInputData } from "./UserSignupInputData";

export interface UserSignupDataAccessInterface {
  validateSignupInput(input: UserSignupInputData): Promise<void>;

  storeSignupInformation(userData: UserSignupInputData): Promise<void>;
}
