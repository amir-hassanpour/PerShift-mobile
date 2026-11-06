import { NewBusinessRequestInputData } from "./NewBusinessRequestInputData";

export interface NewBusinessRequestInputBoundary {
  newBusinessRequested(input: NewBusinessRequestInputData): void;
}
