import { Role } from "@/entity/Role";
import { User } from "@/entity/User";
import {
  AddMemberDAI,
  AddMemberInput,
  AddMemberOutput,
} from "@/usecase/members/add-member/AddMemberDAI";
import {
  LoadMembersInput,
  LoadMembersOutput,
  LoadMembersPageDataAccessInterface,
} from "@/usecase/members/load-members-page/LoadMembersPageDataAccessInterface";
import {
  NewMemberDataAccessInterface,
  NewMemberInputData,
  NewMemberOutputData,
} from "@/usecase/members/new-member/NewMemberDataAccessInterface";
import {
  ScrollMembersDAI,
  ScrollMembersInput,
  ScrollMembersOutput,
} from "@/usecase/members/scroll-members/ScrollMembersDAI";
import {
  LoadCreateShiftPageDAI,
  LoadCreateShiftPageInput,
  LoadCreateShiftPageOutput,
} from "@/usecase/shift/create-shift/load-create-shift-page/LoadCreateShiftPageDAI";
import { BusinessRAMDisk } from "../business-shifts-data/BusinessRAMDisk";
import { supabase } from "../supabase/client";
import { UserRAMDisk } from "../user-data/UserRAMDisk";
import { MemberRAMDisk } from "./MemberRAMDisk";

export class MembersDataAccessObject
  implements
    LoadMembersPageDataAccessInterface,
    NewMemberDataAccessInterface,
    LoadCreateShiftPageDAI,
    AddMemberDAI,
    ScrollMembersDAI
{
  async scrollMembers(input: ScrollMembersInput): Promise<ScrollMembersOutput> {
    if (!Number.isSafeInteger(input.numMembers) || input.numMembers < 0) {
      throw new Error("Page number must be a non-negative integer");
    }

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!business) {
      throw new Error("No business is currently selected");
    }

    const pageSize = 10;
    const from = input.numMembers * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
      profile_id,
      first_name,
      last_name,
      username,
      email,
      created_at,
      avatar_url,
      membership:business_role_assignment!inner(
        business_name,
        role_accepted
      )
    `,
      )
      .eq("membership.business_name", business.id)
      .eq("membership.role_accepted", "accepted")
      .order("first_name", { ascending: true })
      .order("last_name", { ascending: true })
      .order("profile_id", { ascending: true })
      .range(from, to);

    if (error) throw error;
    if (!data) throw new Error("Could not retrieve members");

    const members = data.map((row) => {
      const createdAt = new Date(row.created_at);

      if (!Number.isFinite(createdAt.getTime())) {
        throw new Error(`Member ${row.profile_id} has an invalid date`);
      }

      return new User({
        id: row.profile_id,
        firstName: row.first_name,
        lastName: row.last_name,
        username: row.username,
        email: row.email,
        createdAt,
        avatarUrl: row.avatar_url ?? null,
      });
    });

    return { members };
  }

  async addMember(input: AddMemberInput): Promise<AddMemberOutput> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();
    if (!business) throw new Error("No business available to add member to");

    const { error } = await supabase.from("email_invitation").insert({
      role_id: input.role.id,
      email: input.email,
      business_id: business.id,
      inviter: user.id,
    });

    if (error) {
      console.error(error);
      throw error;
    }
    return {};
  }

  async loadCreateShiftPage(
    input: LoadCreateShiftPageInput,
  ): Promise<LoadCreateShiftPageOutput> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!business)
      throw new Error("No business availbale to get the users to add");

    const { data, error } = await supabase
      .from("assign_user")
      .select("member_profile_id")
      .eq("supervisor_profile_id", user.id)
      .eq("business_id", business.id);

    if (error) throw error;
    if (!data) return { usersToAdd: [] };

    const userToAdd: User[] = [];

    for (const userID of data) {
      const { data: data2, error: error2 } = await supabase
        .from("profiles")
        .select(
          "profile_id, first_name, last_name, email, username, created_at, avatar_url",
        )
        .eq("profile_id", userID.member_profile_id)
        .maybeSingle();

      if (error) throw error2;
      if (!data2) continue;

      userToAdd.push(
        new User({
          id: data2.profile_id,
          firstName: data2.first_name,
          lastName: data2.last_name,
          username: data2.username,
          createdAt: new Date(data2.created_at),
          avatarUrl: data2.avatar_url,
          email: data2.email,
        }),
      );
    }

    return { usersToAdd: userToAdd };
  }

  async newMember(inputData: NewMemberInputData): Promise<NewMemberOutputData> {
    await new MemberRAMDisk().saveMember(inputData.member);
    const members = await new MemberRAMDisk().getMembers();
    const curUser = await new UserRAMDisk().getCurrentUser();
    if (curUser !== null) {
      members.unshift(curUser);
    }
    return { members: members };
  }

  async loadMembers(inputData: LoadMembersInput): Promise<LoadMembersOutput> {
    const members = await new MemberRAMDisk().getMembers();
    const curUser = await new UserRAMDisk().getCurrentUser();

    if (!curUser) throw new Error("No user found on disk");

    const displayedMembers = [
      curUser,
      ...members.filter((member) => member.id !== curUser.id),
    ];

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!business) {
      return {
        members: displayedMembers,
        canAddMembers: false,
        roles: [],
      };
    }

    const { data: curUserRole, error: curUserRoleError } = await supabase
      .from("roles")
      .select(
        `
      id,
      can_invite_members,
      bra:business_role_assignment!inner(
        profile_id,
        business_name,
        role_accepted
      )
    `,
      )
      .eq("bra.profile_id", user.id)
      .eq("bra.business_name", business.id)
      .eq("bra.role_accepted", "accepted")
      .eq("business_id", business.id)
      .maybeSingle();

    if (curUserRoleError) throw curUserRoleError;

    if (!curUserRole) {
      throw new Error("User isn't assigned an accepted role in this business");
    }

    if (!curUserRole.can_invite_members) {
      return {
        members: displayedMembers,
        canAddMembers: false,
        roles: [],
      };
    }

    const { data: assignableRoles, error: assignableRolesError } =
      await supabase
        .from("roles")
        .select(
          `
        id,
        role_name,
        business_id,
        can_invite_members,
        can_create_shifts,
        can_view_assigned_members_hours,
        owner,
        permissions:role_assignment_permissions!assignable_role_id!inner(
          assigner_role_id
        )
      `,
        )
        .eq("permissions.assigner_role_id", curUserRole.id)
        .eq("business_id", business.id);

    if (assignableRolesError) throw assignableRolesError;

    const roles = (assignableRoles ?? []).map(
      (role) =>
        new Role({
          id: role.id,
          roleName: role.role_name,
          businessID: role.business_id,
          canInviteMembers: role.can_invite_members,
          canCreateShifts: role.can_create_shifts,
          canViewAssignedMembersHours: role.can_view_assigned_members_hours,
          owner: role.owner,
        }),
    );

    return {
      members: displayedMembers,
      roles,
      canAddMembers: true,
    };
  }
}
