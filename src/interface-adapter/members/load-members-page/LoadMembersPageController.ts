import { LoadMembersPageInteractor } from "@/usecase/members/load-members-page/LoadMembersPageInteractor";

export class LoadMembersPageController {
  interactor: LoadMembersPageInteractor;

  constructor(interactor: LoadMembersPageInteractor) {
    this.interactor = interactor;
  }

  async loadMembers({}): Promise<void> {
    await this.interactor.loadMembers({});
  }
}
