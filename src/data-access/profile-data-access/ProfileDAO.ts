import {
    LoadProfileInput,
    LoadProfileOutput,
    LoadProfilePageDAI,
} from "@/usecase/profile/load-profile-page/LoadProfilePageDAI";
import { BussinessDataAccessObject } from "../business-shifts-data/BusinessDataAccessObject";
import { BusinessRAMDisk } from "../business-shifts-data/BusinessRAMDisk";
import { UserRAMDisk } from "../user-data/UserRAMDisk";

export class ProfileDAO implements LoadProfilePageDAI {
  async loadProfilePage(
    inputData: LoadProfileInput,
  ): Promise<LoadProfileOutput> {
    const curUser = await new UserRAMDisk().getCurrentUser();

    if (curUser === null) throw new Error("You must be signed in");

    return {
      user: curUser,
      businesses: await new BusinessRAMDisk().getBusinesses(),
      businessesRequested:
        await new BussinessDataAccessObject().getBusinessRequested(),
    };
  }
}
