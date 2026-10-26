import { Training } from "@/entity/Training";
import Storage from "expo-sqlite/kv-store";

const TRAININGS_KEY = "trainings";

type StoredTraining = {
  id: string;
  name: string;
  progress: number;
  business_id: string;
  created_at: string;
};

export class TrainingsRAMDisk {
  private static saveQueue: Promise<void> = Promise.resolve();

  async saveTraining(training: Training): Promise<void> {
    const timestamp = training.created_at.getTime();

    if (!Number.isFinite(timestamp)) {
      throw new Error("Training has an invalid created_at date");
    }

    const snapshot = new Training(
      training.id,
      training.name,
      training.progress,
      training.business_id,
      new Date(timestamp),
    );

    const save = TrainingsRAMDisk.saveQueue.then(async () => {
      const trainings = await this.getTrainings();

      const index = trainings.findIndex(
        (existing) => existing.id === snapshot.id,
      );

      if (index !== -1) {
        trainings[index] = snapshot;
      } else {
        trainings.push(snapshot);
      }

      trainings.sort(
        (a, b) =>
          b.created_at.getTime() - a.created_at.getTime() ||
          a.id.localeCompare(b.id),
      );

      await Storage.setItem(
        TRAININGS_KEY,
        JSON.stringify(trainings.slice(0, 5)),
      );
    });

    TrainingsRAMDisk.saveQueue = save.catch(() => {});
    await save;
  }

  async getTrainings(): Promise<Training[]> {
    const storedValue = await Storage.getItem(TRAININGS_KEY);

    if (storedValue === null) {
      return [];
    }

    const storedTrainings: StoredTraining[] = JSON.parse(storedValue);

    return storedTrainings.map(
      (stored) =>
        new Training(
          stored.id,
          stored.name,
          stored.progress,
          stored.business_id,
          new Date(stored.created_at),
        ),
    );
  }

  async deleteAllTrainings(): Promise<void> {
    const deletion = TrainingsRAMDisk.saveQueue.then(async () => {
      await Storage.removeItem(TRAININGS_KEY);
    });

    TrainingsRAMDisk.saveQueue = deletion.catch(() => {});
    await deletion;
  }
}
