import { supabase } from "@/data-access/supabase/client";
import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { Shift } from "@/entity/Shift";
import {
  DeclineBusinessRequestDataAccessInterface,
  DeclineBusinessRequestInput,
  DeclineBusinessRequestOutput,
} from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestDataAccessInterface";

import { Role } from "@/entity/Role";
import {
  AcceptBusinessRequestDataAccessInterface,
  Acceptinput,
  AcceptOutput,
} from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestDataAccessInterface";
import {
  LoadingMainPageDataAccessInterface,
  LoadMainPage,
} from "@/usecase/main-page/loading-main-page/LoadingMainPageDataAccessInterface";
import {
  NewBusinessRequestDAI,
  NewBusinessRequestInput,
  NewBusinessRequestOutput,
} from "@/usecase/main-page/new-business-request/NewBusinessRequestDAI";
import {
  NewBusinessDAI,
  NewBusinessInput,
  NewBusinessOutput,
} from "@/usecase/main-page/new-business/NewBusinessDAI";
import {
  DeleteShiftDAI,
  DeleteShiftInput,
  DeleteShiftOutput,
} from "@/usecase/shift/delete-shift/DeleteShiftDAI";
import {
  LoadShiftsDAI,
  LoadShiftsInput,
  LoadShiftsOutput,
} from "@/usecase/shift/load-shifts/LoadShiftsDAI";
import {
  UpdateShiftDAI,
  UpdateShiftInput,
  UpdateShiftOutput,
} from "@/usecase/shift/update-shift/UpdateShiftDAI";
import { RoleRAMDisk } from "../user-data/role/RoleRAMDisk";
import { BusinessRAMDisk } from "./BusinessRAMDisk";
import { BusinessShiftsRAMDisk } from "./shift/BusinessShiftsRAMDisk";

export class BussinessDataAccessObject
  implements
    LoadingMainPageDataAccessInterface,
    DeclineBusinessRequestDataAccessInterface,
    AcceptBusinessRequestDataAccessInterface,
    NewBusinessDAI,
    NewBusinessRequestDAI,
    LoadShiftsDAI,
    DeleteShiftDAI,
    UpdateShiftDAI
{
  async updateShift(input: UpdateShiftInput): Promise<UpdateShiftOutput> {
    await new BusinessShiftsRAMDisk().saveShift(input.shift);

    return {};
  }

  async deleteShift(input: DeleteShiftInput): Promise<DeleteShiftOutput> {
    await new BusinessShiftsRAMDisk().deleteShiftByID(input.shiftID);
    return {};
  }

  async loadShifts(input: LoadShiftsInput): Promise<LoadShiftsOutput> {
    if (!Number.isSafeInteger(input.numShifts) || input.numShifts < 0) {
      throw new Error("Page number must be a non-negative integer");
    }

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!business) {
      throw new Error("No business is currently selected");
    }

    const pageSize = 5;
    const from = input.numShifts * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("shift")
      .select(
        `
      id,
      business_id,
      start_time,
      end_time,
      latitude,
      longitude,
      description
    `,
      )
      .eq("business_id", business.id)
      .order("start_time", { ascending: true })
      .order("id", { ascending: true })
      .range(from, to);

    if (error) throw error;
    if (!data) throw new Error("Could not retrieve shifts");

    const parseCoordinate = (value: string | number | null): number | null => {
      if (value === null || String(value).trim() === "") {
        return null;
      }

      const coordinate = Number(value);

      if (!Number.isFinite(coordinate)) {
        throw new Error("Shift contains an invalid coordinate");
      }

      return coordinate;
    };

    const shifts = data.map((row) => {
      const startTime = new Date(row.start_time);
      const endTime = new Date(row.end_time);

      if (
        !Number.isFinite(startTime.getTime()) ||
        !Number.isFinite(endTime.getTime())
      ) {
        throw new Error(`Shift ${row.id} contains an invalid date`);
      }

      return new Shift(
        startTime,
        endTime,
        parseCoordinate(row.latitude),
        parseCoordinate(row.longitude),
        row.business_id,
        row.id,
        row.description ?? "",
      );
    });

    return { shifts };
  }

  async newBusinessRequested(
    input: NewBusinessRequestInput,
  ): Promise<NewBusinessRequestOutput> {
    return { businessesRequested: await this.getBusinessRequested() };
  }

  async newBusiness(input: NewBusinessInput): Promise<NewBusinessOutput> {
    await new BusinessRAMDisk().saveBusiness(input.business);

    return { businesses: await new BusinessRAMDisk().getBusinesses() };
  }

  async acceptBusinessRequest(input: Acceptinput): Promise<AcceptOutput> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in.");

    const { data: assignment, error } = await supabase
      .from("business_role_assignment")
      .update({ role_accepted: "accepted" })
      .eq("business_name", input.businessId)
      .eq("profile_id", user.id)
      .eq("role_accepted", "pending")
      .select("role_id")
      .maybeSingle();

    if (error) throw error;
    if (!assignment) {
      throw new Error("No pending business request was found");
    }

    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select(
        `
    id,
    role_name,
    business_id,
    can_invite_members,
    can_create_shifts,
    can_view_assigned_members_hours,
    owner
  `,
      )
      .eq("id", assignment.role_id)
      .eq("business_id", input.businessId)
      .maybeSingle();

    if (roleError) throw roleError;
    if (!roleData) throw new Error("Role wasn't found");

    const role = new Role({
      id: roleData.id,
      roleName: roleData.role_name,
      businessID: roleData.business_id,
      canInviteMembers: roleData.can_invite_members,
      canCreateShifts: roleData.can_create_shifts,
      canViewAssignedMembersHours: roleData.can_view_assigned_members_hours,
      owner: roleData.owner,
    });

    let newBusinessAccepted = await this.getbusinessInformation(
      input.businessId,
    );

    await new BusinessRAMDisk().saveBusiness(newBusinessAccepted);

    let reloadMainPage = await this.loadMainPage();

    return {
      shifts: reloadMainPage.shifts,
      businesses: reloadMainPage.businesses,
      requestedBusinesses: reloadMainPage.businessRequested,
      role: role,
    };
  }

  async getbusinessInformation(businessID: string): Promise<Business> {
    const { data, error } = await supabase
      .from("business")
      .select("id, business_name")
      .eq("id", businessID)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error("Business not found or you do not have access.");
    }

    return new Business(data.id, data.business_name, new Date());
  }

  async declineBusinessRequest(
    input: DeclineBusinessRequestInput,
  ): Promise<DeclineBusinessRequestOutput> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in.");

    const { data, error } = await supabase
      .from("business_role_assignment")
      .update({ role_accepted: "rejected" })
      .eq("business_name", input.businessId)
      .eq("profile_id", user.id)
      .eq("role_accepted", "pending")
      .select("profile_id");

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error("No pending request was updated.");
    }

    return { businessRequested: await this.getBusinessRequested() };
  }

  async getBusinessRequested(): Promise<BusinessRequested[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw authError;
    }

    if (!user) {
      throw new Error("You must be signed in");
    }

    const { data, error } = await supabase
      .from("business_role_assignment")
      .select(
        `
        business!inner (
          id,
          business_name
        ),
        profile_id,
        role_id,
        role_accepted
        `,
      )
      .eq("profile_id", user.id)
      .eq("role_accepted", "pending")
      .limit(5);

    if (error) {
      throw error;
    }

    return data
      .flatMap((row) => {
        const businesses = Array.isArray(row.business)
          ? row.business
          : [row.business];

        return businesses
          .filter((business) => business != null)
          .map(
            (business) =>
              new BusinessRequested(business.id, business.business_name),
          );
      })
      .slice(0, 5);
  }

  async loadMainPage(): Promise<LoadMainPage> {
    const businessRAMDisk = new BusinessRAMDisk();

    const mostrecentBusiness =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    const allBusinesses = await businessRAMDisk.getBusinesses();
    let allShifts: Shift[] = [];
    let allBusinessRequested = await this.getBusinessRequested();

    if (mostrecentBusiness !== null) {
      allShifts = await new BusinessShiftsRAMDisk().getBusinessShifts(
        mostrecentBusiness.id,
      );
    }

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    let role: Role | undefined = undefined;
    let roles: Role[] = [];

    if (business) {
      roles = await new RoleRAMDisk().getRoles(business.id);
    }

    if (roles.length > 0) role = roles[0];

    const loadMainPage: LoadMainPage = {
      businesses: allBusinesses,
      shifts: allShifts,
      businessRequested: allBusinessRequested,
      role: role,
    };

    return loadMainPage;
  }
}
