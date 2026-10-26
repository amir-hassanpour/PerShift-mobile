import { NewModuleInputData } from "./NewModuleDataAccessInterface";

export interface NewModuleInputBoundary {
  newModule(inputData: NewModuleInputData): void;
}
