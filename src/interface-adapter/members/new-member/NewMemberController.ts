import { NewMemberInteractor } from "@/usecase/members/new-member/NewMemberInteractor";

export class NewMemberController {
  interactor: NewMemberInteractor;

  constructor(interactor: NewMemberInteractor) {
    this.interactor = interactor;
  }

  async newMember(member: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    createdAt: Date;
    avatarUrl?: string | null;
  }) {
    await this.interactor.newMember(member);
  }
}
