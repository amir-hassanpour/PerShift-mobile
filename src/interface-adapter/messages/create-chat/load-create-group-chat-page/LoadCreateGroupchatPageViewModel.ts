import { User } from "@/entity/User";
import { ViewModel } from "@/interface-adapter/ViewModel";
import { LoadCreateGroupchatPageState } from "./LoadCreateGroupchatPageState";

export class LoadCreateGroupchatPageViewModel extends ViewModel {
  state: LoadCreateGroupchatPageState =
    LoadCreateGroupchatPageState.LOAD_CCREATE_GROUPCHAT_PAGE_IDLE;
  users: User[] = [];
  businessID: string = "";
}
