import type { UserSignupOutputData } from "./UserSignupOutputData";

export interface UserSignupOutputBoundary {
  prepareForSuccessView(outputData: UserSignupOutputData): Promise<void>;

  prepareForFailureView(error: string): Promise<void>;
}
