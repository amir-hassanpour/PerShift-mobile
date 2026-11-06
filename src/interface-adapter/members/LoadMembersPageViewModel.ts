import { User } from "@/entity/User";
import { ViewModel } from "../ViewModel";
import { LoadMembersPageState } from "./load-members-page/LoadMembersPageState";
import { NewMemberState } from "./new-member/NewMemberState";

export class LoadMembersPageViewModel extends ViewModel {
  members: User[] = [];
  state: LoadMembersPageState | NewMemberState = LoadMembersPageState.IDLE;
}
