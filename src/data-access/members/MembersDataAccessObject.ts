import { User } from "@/entity/User";
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
    LoadCreateShiftPageDAI
{
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

    if (curUser !== null) {
      return {
        members: [
          curUser,
          ...members.filter((member) => member.id !== curUser.id),
        ],
      };
    }

    return { members };
  }
}
