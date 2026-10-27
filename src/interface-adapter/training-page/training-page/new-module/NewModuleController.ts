import { NewModuleInteractor } from "@/usecase/trainings/training-page/new-module/NewModuleInteractor";

export type ModuleContentBlock =
  | { id: string; type: "text"; text: string }
  | { id: string; type: "image"; url: string; alt: string }
  | { id: string; type: "video"; url: string };

export class NewModuleController {
  interactor: NewModuleInteractor;

  constructor(interactor: NewModuleInteractor) {
    this.interactor = interactor;
  }

  async newModule(module: {
    id: string;
    header: string;
    content: ModuleContentBlock[];
    finished: boolean;
    order_number: number;
    training_id: string;
  }) {
    await this.interactor.newModule({ module });
  }
}
