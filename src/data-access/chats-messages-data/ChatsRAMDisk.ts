import { Chat } from "@/entity/Chat";
import Storage from "expo-sqlite/kv-store";
import { BusinessRAMDisk } from "../business-shifts-data/BusinessRAMDisk";
import { ChatsDataAccessObject } from "./ChatsDataAccessObject";

const CHATS_KEY = "chats";
const MAX_CHATS = 5;

type StoredChat = {
  id: string;
  lastText: string;
  name: string;
  lastTextedAt: Date | undefined;
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
    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!business) return [];

    const storedValue = await Storage.getItem(CHATS_KEY);

    if (storedValue === null) return [];

    const storedChats: StoredChat[] = JSON.parse(storedValue);

    return storedChats
      .filter((stored) => stored.business_id === business.id)
      .map(
        (stored) =>
          new Chat(
            stored.id,
            stored.business_id,
            stored.name,
            stored.lastTextedAt != null
              ? new Date(stored.lastTextedAt)
              : undefined,
            stored.messageCount,
            stored.lastText,
          ),
      )
      .sort(
        (a, b) =>
          (b.lastTextedAt?.getTime() ?? 0) - (a.lastTextedAt?.getTime() ?? 0) ||
          a.id.localeCompare(b.id),
      );
  }

  async getChatByID(chat_id: string): Promise<Chat | undefined> {
    const allChats = await this.getChats();

    for (const chat of allChats) {
      if (chat.id === chat_id) {
        return chat;
      }
    }

    return await new ChatsDataAccessObject().getChatByID(chat_id);
  }

  async deleteAllChats() {
    await Storage.removeItem(CHATS_KEY);
    await Storage.setItem(CHATS_KEY, JSON.stringify([]));
  }
}
