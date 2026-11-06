import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { User } from "@/entity/User";
import { NewBusinessRequestState } from "../main-page/new-business-request/NewBusinessRequestState";
import { NewBusinessState } from "../main-page/new-business/NewBusinessState";
import { ViewModel } from "../ViewModel";
import { LoadProfilePageState } from "./load-profile-page/LoadProfilePageState";

export class LoadProfilePageViewModel extends ViewModel {
  user: User | undefined = undefined;
  businesses: Business[] = [];
  businessesRequested: BusinessRequested[] = [];
  state: LoadProfilePageState | NewBusinessState | NewBusinessRequestState =
    LoadProfilePageState.IDLE;
}
