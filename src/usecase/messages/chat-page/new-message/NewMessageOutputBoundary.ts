import { NewMessageOutputData } from "./NewMessageOutputData";

export interface NewMessageOutputBoundary {
  prepareForSuccessView(ouputData: NewMessageOutputData): Promise<void>;

  prepareForFailureView(error: Error): Promise<void>;
}
