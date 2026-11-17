import { AddMemberDAI } from "./AddMemberDAI";
import { AddMemberInputBoundary } from "./AddMemberInputBoundary";
import { AddMemberInputData } from "./AddMemberInputData";
import { AddMemberOutputBoundary } from "./AddMemberOutputBoundary";

export class AddMemberInteractor implements AddMemberInputBoundary {
  constructor(
    private outputBoundary: AddMemberOutputBoundary,
    private dao: AddMemberDAI,
  ) {}

  async addMember(input: AddMemberInputData): Promise<void> {
    try {
      await this.dao.addMember(input);

      this.outputBoundary.prepareForSuccessView();
    } catch (error) {
      this.outputBoundary.prepareForFailureView(error as Error);
    }
  }
}
