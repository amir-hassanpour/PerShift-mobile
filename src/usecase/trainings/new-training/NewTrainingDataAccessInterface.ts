import { Training } from "@/entity/Training";

export type InputDataNewTraining = {
  training: Training;
};

export type OutputDataNewTraining = {
  trainings: Training[];
};

export interface NewTrainingDataAccessInterface {
  newTraining(inputData: InputDataNewTraining): Promise<OutputDataNewTraining>;
}
