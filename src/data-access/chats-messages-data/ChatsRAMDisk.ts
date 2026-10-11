import { Chat } from "@/entity/Chat";
import Storage from "expo-sqlite/kv-store";

const CHATS_KEY = "chats";
const MAX_CHATS = 5;

type StoredChat = {
  id: string;
  lastText: string;
  name: string;
  lastTextedAt: string;
  messageCount: number;
};

export class ChatsRAMDisk {
  // Serialize saves so simultaneous updates don't overwrite each other.
  private static saveQueue: Promise<void> = Promise.resolve();

  async saveChat(chat: Chat): Promise<void> {
    const timestamp = chat.lastTextedAt.getTime();

    if (!Number.isFinite(timestamp)) {
      throw new Error("Chat has an invalid lastTextedAt date");
    }

    // Capture the values before waiting for another save.
    const savedChat = new Chat(
      chat.id,
      chat.lastText,
      chat.name,
      new Date(timestamp),
      chat.messageCount,
    );

    const save = ChatsRAMDisk.saveQueue.then(async () => {
      const chats = await this.getChats();
      const index = chats.findIndex((existing) => existing.id === savedChat.id);

      if (index !== -1) {
        chats[index] = savedChat;
      } else {
        chats.push(savedChat);
      }

      chats.sort(
        (a, b) =>
          b.lastTextedAt.getTime() - a.lastTextedAt.getTime() ||
          a.id.localeCompare(b.id),
      );

      await Storage.setItem(
        CHATS_KEY,
        JSON.stringify(chats.slice(0, MAX_CHATS)),
      );
    });

    // A failed save must not block subsequent saves.
    ChatsRAMDisk.saveQueue = save.catch(() => {});

    await save;
  }

  async getChats(): Promise<Chat[]> {
    const storedValue = await Storage.getItem(CHATS_KEY);

    if (storedValue === null) {
      return [];
    }

    const storedChats: StoredChat[] = JSON.parse(storedValue);

    return storedChats
      .map(
        (stored) =>
          new Chat(
            stored.id,
            stored.lastText,
            stored.name,
            new Date(stored.lastTextedAt),
            stored.messageCount,
          ),
      )
      .sort(
        (a, b) =>
          b.lastTextedAt.getTime() - a.lastTextedAt.getTime() ||
          a.id.localeCompare(b.id),
      )
      .slice(0, MAX_CHATS);
  }
}
