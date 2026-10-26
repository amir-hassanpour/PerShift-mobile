import { Module } from "@/entity/Module";
import Storage from "expo-sqlite/kv-store";
import { TrainingsRAMDisk } from "./TrainingsRAMDisk";

const MODULES_KEY = "modules";

type StoredModule = {
  id: string;
  header: string;
  content: Module["content"];
  finished: boolean;
  order_number: number;
  training_id: string;
};

export class ModuleRAMDisk {
  private static saveQueue: Promise<void> = Promise.resolve();

  private enqueue(operation: () => Promise<void>): Promise<void> {
    const task = ModuleRAMDisk.saveQueue.then(operation);
    ModuleRAMDisk.saveQueue = task.catch(() => {});
    return task;
  }

  private async readModules(): Promise<Module[]> {
    const value = await Storage.getItem(MODULES_KEY);

    if (value === null) return [];

    const stored: StoredModule[] = JSON.parse(value);

    return stored.map(
      (module) =>
        new Module(
          module.id,
          module.header,
          module.content,
          module.finished,
          module.order_number,
          module.training_id,
        ),
    );
  }

  private async filterModules(modules: Module[]): Promise<Module[]> {
    const trainings = await new TrainingsRAMDisk().getTrainings();
    const trainingIDs = new Set(trainings.map((training) => training.id));

    // Deduplicate by module ID.
    const uniqueModules = new Map<string, Module>();

    for (const module of modules) {
      if (trainingIDs.has(module.training_id)) {
        uniqueModules.set(module.id, module);
      }
    }

    const sorted = [...uniqueModules.values()].sort(
      (a, b) =>
        a.training_id.localeCompare(b.training_id) ||
        a.order_number - b.order_number ||
        a.id.localeCompare(b.id),
    );

    const counts = new Map<string, number>();

    return sorted.filter((module) => {
      const count = counts.get(module.training_id) ?? 0;

      if (count >= 3) return false;

      counts.set(module.training_id, count + 1);
      return true;
    });
  }

  async saveModule(module: Module): Promise<void> {
    const snapshot = new Module(
      module.id,
      module.header,
      module.content.map((block) => ({ ...block })),
      module.finished,
      module.order_number,
      module.training_id,
    );

    await this.enqueue(async () => {
      const modules = await this.readModules();

      const index = modules.findIndex(
        (existing) => existing.id === snapshot.id,
      );

      if (index === -1) {
        modules.push(snapshot);
      } else {
        modules[index] = snapshot;
      }

      const filtered = await this.filterModules(modules);
      await Storage.setItem(MODULES_KEY, JSON.stringify(filtered));
    });
  }

  async getModules(): Promise<Module[]> {
    let result: Module[] = [];

    await this.enqueue(async () => {
      const modules = await this.readModules();
      result = await this.filterModules(modules);

      // Remove modules belonging to trainings no longer cached.
      await Storage.setItem(MODULES_KEY, JSON.stringify(result));
    });

    return result;
  }

  async deleteAllModules(): Promise<void> {
    await this.enqueue(async () => {
      await Storage.removeItem(MODULES_KEY);
    });
  }
}
