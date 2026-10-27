import { Module } from "@/entity/Module";

export type LoadTrainingPageInput = {
  trainingID: string;
};

export type LoadTrainingPageOutput = {
  modules: Module[];
};

export interface LoadTrainingPageDataAccessInterface {
  loadTrainingPage(
    inputData: LoadTrainingPageInput,
  ): Promise<LoadTrainingPageOutput>;
}
