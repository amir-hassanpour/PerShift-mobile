import { LoadingMainPageOutputData } from "./LoadingMainPageOutputData";

export interface LoadingMainPageOutputBoundary {
  prepareForSuccessView(outputData: LoadingMainPageOutputData): Promise<void>;

  prepareForFailureView(error: string): Promise<void>;
}
