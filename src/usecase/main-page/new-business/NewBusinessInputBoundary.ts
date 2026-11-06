import { NewBusinessInputData } from "./NewBusinessInputData";

export interface NewBusinessInputBoundary {
  newBusiness(input: NewBusinessInputData): void;
}
