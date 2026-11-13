import { Message } from "@/entity/Message";
import Storage from "expo-sqlite/kv-store";

const MAX_MESSAGES = 10;

type StoredMessage = {
  id: string;
  chat_id: string;
  content: string;
  time: string;
  sender_id: string;
};

export class MessagesRAMDisk {
  private static saveQueue: Promise<void> = Promise.resolve();

  private getKey(chatId: string): string {
    return `messages:${chatId}`;
  }

  async saveMessage(message: Message): Promise<void> {
    const snapshot = new Message(
      message.id,
      message.chat_id,
      message.content,
      new Date(message.time.getTime()),
      message.sender_id,
    );

    const save = MessagesRAMDisk.saveQueue.then(async () => {
      const messages = await this.getMessages(snapshot.chat_id);

      const index = messages.findIndex(
        (existing) => existing.id === snapshot.id,
      );

      if (index !== -1) {
        messages[index] = snapshot;
      } else {
        messages.push(snapshot);
      }

      messages.sort(
        (a, b) =>
          b.time.getTime() - a.time.getTime() || a.id.localeCompare(b.id),
      );

      await Storage.setItem(
        this.getKey(snapshot.chat_id),
        JSON.stringify(messages.slice(0, MAX_MESSAGES)),
      );
    });

    MessagesRAMDisk.saveQueue = save.catch(() => {});

    await save;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const storedValue = await Storage.getItem(this.getKey(chatId));

    if (storedValue === null) {
      return [];
    }

    const storedMessages: StoredMessage[] = JSON.parse(storedValue);

    return storedMessages
      .map(
        (stored) =>
          new Message(
            stored.id,
            stored.chat_id,
            stored.content,
            new Date(stored.time),
            stored.sender_id,
          ),
      )
      .sort(
        (a, b) =>
          a.time.getTime() - b.time.getTime() || a.id.localeCompare(b.id),
      )
      .slice(0, MAX_MESSAGES);
  }

  async deleteAllMessages(): Promise<void> {
    const task = MessagesRAMDisk.saveQueue.then(async () => {
      const keys = await Storage.getAllKeys();

      const messageKeys = keys.filter((key) => key.startsWith("messages:"));

      for (const key of messageKeys) {
        await Storage.removeItem(key);
      }
    });

    MessagesRAMDisk.saveQueue = task.catch(() => {});
    await task;
  }
}
