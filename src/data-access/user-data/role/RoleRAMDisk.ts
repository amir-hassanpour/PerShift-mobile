import { Role, type RoleProps } from "@/entity/Role";
import Storage from "expo-sqlite/kv-store";

const ROLES_KEY = "roles";

export class RoleRAMDisk {
  private static saveQueue: Promise<void> = Promise.resolve();

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const task = RoleRAMDisk.saveQueue.then(operation);

    RoleRAMDisk.saveQueue = task.then(
      () => {},
      () => {},
    );

    return task;
  }

  private async readRoles(): Promise<Role[]> {
    const value = await Storage.getItem(ROLES_KEY);

    if (value === null) return [];

    const stored: RoleProps[] = JSON.parse(value);

    return stored.map((role) => new Role(role));
  }

  async saveRole(role: Role): Promise<void> {
    const snapshot = new Role({
      id: role.id,
      roleName: role.roleName,
      businessID: role.businessID,
      canInviteMembers: role.canInviteMembers,
      canCreateShifts: role.canCreateShifts,
      canViewAssignedMembersHours: role.canViewAssignedMembersHours,
      owner: role.owner,
    });

    await this.enqueue(async () => {
      const roles = await this.readRoles();

      const rolesByID = new Map(
        roles.map((existing) => [existing.id, existing]),
      );

      rolesByID.set(snapshot.id, snapshot);

      await Storage.setItem(ROLES_KEY, JSON.stringify([...rolesByID.values()]));
    });
  }

  async getRoles(businessID: string): Promise<Role[]> {
    return this.enqueue(async () => {
      const roles = await this.readRoles();

      return roles
        .filter((role) => role.businessID === businessID)
        .sort(
          (a, b) =>
            a.roleName.localeCompare(b.roleName) || a.id.localeCompare(b.id),
        );
    });
  }

  async getRoleByID(roleID: string): Promise<Role | undefined> {
    return this.enqueue(async () => {
      const roles = await this.readRoles();

      return roles.find((role) => role.id === roleID);
    });
  }

  async deleteRoleByID(roleID: string): Promise<void> {
    await this.enqueue(async () => {
      const roles = await this.readRoles();

      const remaining = roles.filter((role) => role.id !== roleID);

      await Storage.setItem(ROLES_KEY, JSON.stringify(remaining));
    });
  }

  async deleteBusinessRoles(businessID: string): Promise<void> {
    await this.enqueue(async () => {
      const roles = await this.readRoles();

      const remaining = roles.filter((role) => role.businessID !== businessID);

      await Storage.setItem(ROLES_KEY, JSON.stringify(remaining));
    });
  }

  async deleteAllRoles(): Promise<void> {
    await this.enqueue(async () => {
      await Storage.removeItem(ROLES_KEY);
    });
  }
}
