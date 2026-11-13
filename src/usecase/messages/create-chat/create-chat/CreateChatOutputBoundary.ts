import { CreateChatOutputData } from "./CreateChatOutputData";

export interface CreateChatOutputBoundary {
  preparepForSuccessView(output: CreateChatOutputData): void;

  prepareForMinimumUserRequirementFailure(): void;

  prepareForFailureView(error: string): void;
}
