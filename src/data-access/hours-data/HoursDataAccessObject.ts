import { User } from "@/entity/User";
import {
    CheckHoursDAI,
    CheckHoursInput,
    CheckHoursOutput,
} from "@/usecase/hours/check-hours/CheckHoursDAI";
import {
    LoadHoursPageInput,
    LoadHoursPageOutput,
    LoadHoursPgaeDAI,
} from "@/usecase/hours/load-hours-page/LoadHoursPageDAI";
import { BusinessRAMDisk } from "../business-shifts-data/BusinessRAMDisk";
import { supabase } from "../supabase/client";
import { UserRAMDisk } from "../user-data/UserRAMDisk";
import { HoursRAMDisk } from "./HoursRAMDisk";

export class HoursDataAccessObject implements LoadHoursPgaeDAI, CheckHoursDAI {
  async checkHours(input: CheckHoursInput): Promise<CheckHoursOutput> {
    await new HoursRAMDisk().deleteAllHours();
    const hoursRAMDisk = new HoursRAMDisk();

    const users = [
      ...new Map(input.user.map((user) => [user.id, user])).values(),
    ];

    const cachedHours = await hoursRAMDisk.getHours({
      startDate: input.startDate,
      endDate: input.endDate,
      users,
    });

    const hoursByUserID = new Map(
      cachedHours.map((hours) => [hours.user.id, hours]),
    );

    const notFoundUsers = users.filter((user) => !hoursByUserID.has(user.id));

    if (notFoundUsers.length > 0) {
      const business =
        await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

      if (!business) {
        throw new Error("No business is selected");
      }

      for (const user of notFoundUsers) {
        const { data: hoursData, error: hoursError } = await supabase
          .from("shift_assignment")
          .select(
            `
          shift_id,
          profile_id,
          shift:shift!inner(
            id,
            start_time,
            end_time
          )
        `,
          )
          .eq("profile_id", user.id)
          .eq("business_id", business.id)
          .gte("shift.start_time", input.startDate.toISOString())
          .lte("shift.end_time", input.endDate.toISOString());

        if (hoursError) throw hoursError;
        if (!hoursData) {
          throw new Error(`Could not retrieve hours for ${user.id}`);
        }

        let userTotalMinutes = 0;

        for (const assignment of hoursData) {
          // Handles either inferred array or single-object results.
          const shift = Array.isArray(assignment.shift)
            ? assignment.shift[0]
            : assignment.shift;

          if (!shift) {
            throw new Error(`Missing shift ${assignment.shift_id}`);
          }

          const start = new Date(shift.start_time).getTime();
          const end = new Date(shift.end_time).getTime();

          if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
            throw new Error(`Invalid times for shift ${shift.id}`);
          }

          userTotalMinutes += (end - start) / 60_000;
        }

        hoursByUserID.set(user.id, {
          user,
          totalMinutes: userTotalMinutes,
          totalHours: userTotalMinutes / 60,
        });
      }

      await hoursRAMDisk.saveHours({
        startDate: input.startDate,
        endDate: input.endDate,
        hoursForUsers: [...hoursByUserID.values()],
      });
    }

    const totalMinutes = [...hoursByUserID.values()].reduce(
      (sum, hours) => sum + hours.totalMinutes,
      0,
    );

    return {
      totalMinutes,
      totalHours: totalMinutes / 60,
    };
  }

  async loadHoursPage(input: LoadHoursPageInput): Promise<LoadHoursPageOutput> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("No authenticated user found.");

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!business)
      throw new Error("No business found for the authenticated user.");

    const { data: users, error: usersError } = await supabase
      .from("assign_user")
      .select("id, business_id, supervisor_profile_id, member_profile_id")
      .eq("supervisor_profile_id", user.id)
      .eq("business_id", business.id);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      throw usersError;
    }
    if (!users)
      throw new Error("No users found for the authenticated user's business.");

    const userProfiles: User[] = [];

    for (const user of users) {
      const { data: memberProfile, error: memberProfileError } = await supabase
        .from("profiles")
        .select(
          "profile_id, first_name, last_name, username, email, created_at, avatar_url",
        )
        .eq("profile_id", user.member_profile_id)
        .maybeSingle();

      if (memberProfileError) {
        console.error("Error fetching member profile:", memberProfileError);
        throw memberProfileError;
      }
      if (!memberProfile)
        throw new Error(`No member profile found for user with id ${user.id}.`);

      userProfiles.push(
        new User({
          id: memberProfile.profile_id,
          firstName: memberProfile.first_name,
          lastName: memberProfile.last_name,
          username: memberProfile.username,
          email: memberProfile.email,
          createdAt: new Date(memberProfile.created_at),
          avatarUrl: memberProfile.avatar_url,
        }),
      );
    }

    const currentUser = await new UserRAMDisk().getCurrentUser();
    if (!currentUser) throw new Error("Current user not found on RAM disk.");

    userProfiles.push(currentUser);

    return { users: userProfiles };
  }
}
