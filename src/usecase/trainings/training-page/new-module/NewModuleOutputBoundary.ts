import { NewModuleOutputData } from "./NewModuleOutputData";

export interface NewModuleOutputBoundary {
  prepareForSuccesView(outputData: NewModuleOutputData): void;

  prepareForFailureView(error: string): void;
}
