import { Module } from "@/entity/Module";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { NewModuleState } from "./new-module/NewModuleState";

export class LoadTrainingPageViewModel extends ViewModel {
  modules: Module[] = [];
  state: NewModuleState = NewModuleState.IDLE;
}
