import { LoadMembersPageOutputData } from "./LoadMembersPageOutputData";

export interface LoadMembersPageOutputBoundary {
  prepareForSuccsessView(outputData: LoadMembersPageOutputData): void;

  prepareForFailureView(error: string): void;
}
