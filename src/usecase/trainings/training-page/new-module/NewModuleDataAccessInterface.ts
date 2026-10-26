import { Module } from "@/entity/Module";

export type NewModuleInputData = {
  module: Module;
};

export type NewModuleOutputData = {
  modules: Module[];
};

export interface NewModuleDataAccessInterface {
  newModule(newModule: NewModuleInputData): Promise<NewModuleOutputData>;
}
