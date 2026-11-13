export type RoleProps = {
  id: string;
  roleName: string;
  businessID: string;
  canInviteMembers: boolean;
  canCreateShifts: boolean;
  canViewAssignedMembersHours: boolean;
  owner: boolean;
};

export class Role {
  public readonly id: string;
  public readonly roleName: string;
  public readonly businessID: string;
  public readonly canInviteMembers: boolean;
  public readonly canCreateShifts: boolean;
  public readonly canViewAssignedMembersHours: boolean;
  public readonly owner: boolean;

  constructor(props: RoleProps) {
    if (!props.roleName.trim()) {
      throw new Error("Role name is required");
    }

    this.id = props.id;
    this.roleName = props.roleName.trim();
    this.businessID = props.businessID;
    this.canInviteMembers = props.canInviteMembers;
    this.canCreateShifts = props.canCreateShifts;
    this.canViewAssignedMembersHours = props.canViewAssignedMembersHours;
    this.owner = props.owner;
  }
}
