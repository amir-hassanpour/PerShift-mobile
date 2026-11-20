import { Role } from "@/entity/Role";
import { User } from "@/entity/User";
import { ViewModel } from "../ViewModel";
import { AddMemberState } from "./add-member/AddMemberState";
import { LoadMembersPageState } from "./load-members-page/LoadMembersPageState";
import { NewMemberState } from "./new-member/NewMemberState";
import { ScrollMembersState } from "./scroll-members/ScrollMembersState";

export class LoadMembersPageViewModel extends ViewModel {
  members: User[] = [];
  state:
    | LoadMembersPageState
    | NewMemberState
    | AddMemberState
    | ScrollMembersState = LoadMembersPageState.IDLE;
  canAddMembers: boolean = false;
  roles: Role[] = [];
}
