import { Training } from "@/entity/Training";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { LoadTrainingsPageState } from "./load-trainings/LoadTrainingsPageState";
import { NewTrainingState } from "./new-training/NewTrainingState";

export class LoadTrainingsPageViewModel extends ViewModel {
  trainings: Training[] = [];
  state: LoadTrainingsPageState | NewTrainingState =
    LoadTrainingsPageState.IDLE;

  constructor() {
    super();
  }

  loadTrainingsPage(Trainingss: Training[]) {
    this.trainings = Trainingss;
    this.state = LoadTrainingsPageState.SUCCCESS;
    this.firePropertyChange();
  }
}
