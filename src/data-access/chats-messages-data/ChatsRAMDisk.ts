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
  business_id: string;
};

export class ChatsRAMDisk {
  private static saveQueue: Promise<void> = Promise.resolve();

  async saveChat(chat: Chat): Promise<void> {
    let timestamp: number;
    if (chat.lastTextedAt !== undefined) {
      timestamp = chat.lastTextedAt.getTime();
    } else {
      timestamp = Infinity;
    }

    if (!Number.isFinite(timestamp)) {
      throw new Error("Chat has an invalid lastTextedAt date");
    }

    const savedChat = new Chat(chat.id, chat.lastText, chat.name);
    savedChat.lastTextedAt = new Date(timestamp);
    savedChat.messageCount = chat.messageCount;
    savedChat.business_id = chat.business_id;

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
          (b.lastTextedAt !== undefined ? b.lastTextedAt.getTime() : 0) -
            (a.lastTextedAt !== undefined ? a.lastTextedAt.getTime() : 0) ||
          a.id.localeCompare(b.id),
      );

      await Storage.setItem(
        CHATS_KEY,
        JSON.stringify(chats.slice(0, MAX_CHATS)),
      );
    });

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
            stored.business_id,
          ),
      )
      .sort(
        (a, b) =>
          (b.lastTextedAt !== undefined ? b.lastTextedAt.getTime() : 0) -
            (a.lastTextedAt !== undefined ? a.lastTextedAt.getTime() : 0) ||
          a.id.localeCompare(b.id),
      )
      .slice(0, MAX_CHATS);
  }
}
