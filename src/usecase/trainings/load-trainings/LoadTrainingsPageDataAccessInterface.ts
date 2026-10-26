import { Training } from "@/entity/Training";

export type InputData = {};

export type outputData = {
  trainings: Training[];
};

export interface LoadTrainingsPageDataAccessInterface {
  loadTrainingsData(inputData: InputData): Promise<outputData>;
}
