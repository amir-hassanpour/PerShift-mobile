import { NewMemberOutputData } from "./NewMemberDataAccessInterface";

export interface NewMemberOutputBoundary {
  prepareForSuccessView(outputData: NewMemberOutputData): void;

  prepareForFailureView(error: string): void;
}
