import { User } from "@/entity/User";
import Storage from "expo-sqlite/kv-store";

const CURRENT_USER_KEY = "current_user";

type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: string;
  avatarUrl?: string | null;
};

export class UserRAMDisk {
  private currentUser: User | null = null;

  async saveCurrentUser(user: User): Promise<void> {
    const storedUser: StoredUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      avatarUrl: user.avatarUrl,
    };

    await Storage.setItem(CURRENT_USER_KEY, JSON.stringify(storedUser));

    this.currentUser = user;
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    const storedValue = await Storage.getItem(CURRENT_USER_KEY);

    if (!storedValue) {
      return null;
    }

    const storedUser = JSON.parse(storedValue) as StoredUser;

    this.currentUser = new User({
      id: storedUser.id,
      firstName: storedUser.firstName,
      lastName: storedUser.lastName,
      username: storedUser.username,
      email: storedUser.email,
      createdAt: new Date(storedUser.createdAt),
      avatarUrl: storedUser.avatarUrl,
    });

    return this.currentUser;
  }

  async clearCurrentUser(): Promise<void> {
    await Storage.removeItem(CURRENT_USER_KEY);
    this.currentUser = null;
  }
}
