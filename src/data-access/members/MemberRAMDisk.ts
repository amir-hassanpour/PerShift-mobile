import { User } from "@/entity/User";
import Storage from "expo-sqlite/kv-store";

const MEMBERS_KEY = "members";
const MAX_MEMBERS = 10;

type StoredMember = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: string;
  avatarUrl?: string | null;
};

export class MemberRAMDisk {
  private static saveQueue: Promise<void> = Promise.resolve();

  private enqueue(operation: () => Promise<void>): Promise<void> {
    const task = MemberRAMDisk.saveQueue.then(operation);

    MemberRAMDisk.saveQueue = task.catch(() => {});

    return task;
  }

  private sortAndLimit(members: User[]): User[] {
    return [...members]
      .sort(
        (a, b) =>
          a.firstName.localeCompare(b.firstName, undefined, {
            sensitivity: "base",
          }) ||
          a.lastName.localeCompare(b.lastName, undefined, {
            sensitivity: "base",
          }) ||
          a.id.localeCompare(b.id),
      )
      .slice(0, MAX_MEMBERS);
  }

  private async readMembers(): Promise<User[]> {
    const value = await Storage.getItem(MEMBERS_KEY);

    if (value === null) return [];

    const storedMembers: StoredMember[] = JSON.parse(value);

    return storedMembers.map(
      (member) =>
        new User({
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          username: member.username,
          email: member.email,
          createdAt: new Date(member.createdAt),
          avatarUrl: member.avatarUrl,
        }),
    );
  }

  async saveMember(member: User): Promise<void> {
    const timestamp = member.createdAt.getTime();

    if (!Number.isFinite(timestamp)) {
      throw new Error("Member has an invalid createdAt date");
    }

    const snapshot = new User({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      username: member.username,
      email: member.email,
      createdAt: new Date(timestamp),
      avatarUrl: member.avatarUrl,
    });

    await this.enqueue(async () => {
      const members = await this.readMembers();

      const membersById = new Map<string, User>();

      for (const existing of members) {
        membersById.set(existing.id, existing);
      }

      membersById.set(snapshot.id, snapshot);

      const storedMembers: StoredMember[] = this.sortAndLimit([
        ...membersById.values(),
      ]).map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        username: item.username,
        email: item.email,
        createdAt: item.createdAt.toISOString(),
        avatarUrl: item.avatarUrl,
      }));

      await Storage.setItem(MEMBERS_KEY, JSON.stringify(storedMembers));
    });
  }

  async removeDuplicateMembers(): Promise<void> {
    await this.enqueue(async () => {
      const members = await this.readMembers();

      const membersById = new Map<string, User>();

      for (const member of members) {
        membersById.set(member.id, member);
      }

      const storedMembers: StoredMember[] = this.sortAndLimit([
        ...membersById.values(),
      ]).map((member) => ({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        username: member.username,
        email: member.email,
        createdAt: member.createdAt.toISOString(),
        avatarUrl: member.avatarUrl,
      }));

      await Storage.setItem(MEMBERS_KEY, JSON.stringify(storedMembers));
    });
  }

  async getMembers(): Promise<User[]> {
    let members: User[] = [];

    await this.enqueue(async () => {
      members = this.sortAndLimit(await this.readMembers());
    });

    return members;
  }

  async deleteAllMembers(): Promise<void> {
    await this.enqueue(async () => {
      await Storage.removeItem(MEMBERS_KEY);
    });
  }

  async deleteMemberById(memberId: string): Promise<void> {
    await this.enqueue(async () => {
      const members = await this.readMembers();
      const remaining = members.filter((member) => member.id !== memberId);

      if (remaining.length === members.length) return;

      const storedMembers: StoredMember[] = remaining.map((member) => ({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        username: member.username,
        email: member.email,
        createdAt: member.createdAt.toISOString(),
        avatarUrl: member.avatarUrl,
      }));

      await Storage.setItem(MEMBERS_KEY, JSON.stringify(storedMembers));
    });
  }
}
