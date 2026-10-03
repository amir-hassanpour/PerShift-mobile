import { supabase } from "@/data-access/supabase/client";
import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { Shift } from "@/entity/Shift";
import {
  LoadingMainPageDataAccessInterface,
  LoadMainPage,
} from "@/usecase/main-page/loading-main-page/LoadingMainPageDataAccessInterface";
import { BusinessRAMDisk } from "./BusinessRAMDisk";
import { BusinessShiftsRAMDisk } from "./BusinessShiftsRAMDisk";

export class BussinessDataAccessObject implements LoadingMainPageDataAccessInterface {
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
