import { NewModuleDataAccessInterface } from "./NewModuleDataAccessInterface";
import { NewModuleInputBoundary } from "./NewModuleInputBoundary";
import { NewModuleInputData } from "./NewModuleInputData";
import { NewModuleOutputBoundary } from "./NewModuleOutputBoundary";

export class NewModuleInteractor implements NewModuleInputBoundary {
  dao: NewModuleDataAccessInterface;
  outputBoundary: NewModuleOutputBoundary;

  constructor(
    dao: NewModuleDataAccessInterface,
    outputBoundary: NewModuleOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async newModule(inputData: NewModuleInputData): Promise<void> {
    try {
      const result = await this.dao.newModule(inputData);

      this.outputBoundary.prepareForSuccesView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "coudn't complete the new module in the interactor",
      );
    }
  }
}
