import { Module } from "@/entity/Module";
import { NewModuleInteractor } from "@/usecase/trainings/training-page/new-module/NewModuleInteractor";

export class NewModuleController {
  interactor: NewModuleInteractor;

  constructor(interactor: NewModuleInteractor) {
    this.interactor = interactor;
  }

  async newModule(module: Module) {
    await this.interactor.newModule({ module });
  }
}
