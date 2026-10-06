import { supabase } from "@/data-access/supabase/client";
import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { Shift } from "@/entity/Shift";
import {
  DeclineBusinessRequestDataAccessInterface,
  DeclineBusinessRequestInput,
  DeclineBusinessRequestOutput,
} from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestDataAccessInterface";

import {
  AcceptBusinessRequestDataAccessInterface,
  Acceptinput,
  AcceptOutput,
} from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestDataAccessInterface";
import {
  LoadingMainPageDataAccessInterface,
  LoadMainPage,
} from "@/usecase/main-page/loading-main-page/LoadingMainPageDataAccessInterface";
import { BusinessRAMDisk } from "./BusinessRAMDisk";
import { BusinessShiftsRAMDisk } from "./BusinessShiftsRAMDisk";

export class BussinessDataAccessObject
  implements
    LoadingMainPageDataAccessInterface,
    DeclineBusinessRequestDataAccessInterface,
    AcceptBusinessRequestDataAccessInterface
{
  async acceptBusinessRequest(input: Acceptinput): Promise<AcceptOutput> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in.");

    const { data, error } = await supabase
      .from("business_role_assignment")
      .update({ role_accepted: "accepted" })
      .eq("business_name", input.businessId)
      .eq("profile_id", user.id)
      .eq("role_accepted", "pending")
      .select("profile_id");

    let newBusinessAccepted = await this.getbusinessInformation(
      input.businessId,
    );
    new BusinessRAMDisk().savaBusiness(newBusinessAccepted);

    let reloadMainPage = await this.loadMainPage();

    return {
      shifts: reloadMainPage.shifts,
      businesses: reloadMainPage.businesses,
      requestedBusinesses: reloadMainPage.businessRequested,
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
    const businessShiftsRAMDisk = new BusinessShiftsRAMDisk();

    const allBusinesses = await businessRAMDisk.getBusinesses();
    let allShifts: Shift[] = [];
    let allBusinessRequested = await this.getBusinessRequested();

    let defaultBusiness: Business | null = null;
    let mostRecentDate: Date | null = null;

    for (const business of allBusinesses) {
      if (mostRecentDate === null) {
        mostRecentDate = business.lastCheckedIn;
      } else {
        if (business.lastCheckedIn.getTime() > mostRecentDate.getTime()) {
          defaultBusiness = business;
          break;
        }
      }
    }

    if (defaultBusiness !== null) {
      allShifts =
        await businessShiftsRAMDisk.getBusinessShifts(defaultBusiness);
    }

    const loadMainPage: LoadMainPage = {
      businesses: allBusinesses,
      shifts: allShifts,
      businessRequested: allBusinessRequested,
    };

    return loadMainPage;
  }
}
