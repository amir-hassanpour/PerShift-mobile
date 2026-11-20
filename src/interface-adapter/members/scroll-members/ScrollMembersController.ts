import { ScrollMembersInteractor } from "@/usecase/members/scroll-members/ScrollMembersInteractor";

export class ScrollMembersController {
  interactor: ScrollMembersInteractor;

  constructor(interactor: ScrollMembersInteractor) {
    this.interactor = interactor;
  }

  async scrollMembers(input: { numMembers: number }) {
    await this.interactor.scrollMmebers(input);
  }
}
