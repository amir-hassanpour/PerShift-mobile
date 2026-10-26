import {
  InputData,
  LoadTrainingsPageDataAccessInterface,
  outputData,
} from "@/usecase/trainings/load-trainings/LoadTrainingsPageDataAccessInterface";
import {
  InputDataNewTraining,
  NewTrainingDataAccessInterface,
  OutputDataNewTraining,
} from "@/usecase/trainings/new-training/NewTrainingDataAccessInterface";
import {
  NewModuleDataAccessInterface,
  NewModuleInputData,
  NewModuleOutputData,
} from "@/usecase/trainings/training-page/new-module/NewModuleDataAccessInterface";
import { ModuleRAMDisk } from "./ModuleRAMDisk";
import { TrainingsRAMDisk } from "./TrainingsRAMDisk";

export class TrainingsDataAccessObject
  implements
    LoadTrainingsPageDataAccessInterface,
    NewTrainingDataAccessInterface,
    NewModuleDataAccessInterface
{
  async newModule(newModule: NewModuleInputData): Promise<NewModuleOutputData> {
    await new ModuleRAMDisk().saveModule(newModule.module);

    return { modules: await new ModuleRAMDisk().getModules() };
  }
  async newTraining(
    inputData: InputDataNewTraining,
  ): Promise<OutputDataNewTraining> {
    await new TrainingsRAMDisk().saveTraining(inputData.training);
    return { trainings: await new TrainingsRAMDisk().getTrainings() };
  }

  async loadTrainingsData(_inputData: InputData): Promise<outputData> {
    const trainings = await new TrainingsRAMDisk().getTrainings();

    return { trainings: trainings };
  }
}
