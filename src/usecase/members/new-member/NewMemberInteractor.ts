import { NewMemberDataAccessInterface } from "./NewMemberDataAccessInterface";
import { NewMemberInputBoundary } from "./NewMemberInputBoundary";
import { NewMemberInputData } from "./NewMemberInputData";
import { NewMemberOutputBoundary } from "./NewMemberOutputBoundary";

export class NewMemberInteractor implements NewMemberInputBoundary {
  dao: NewMemberDataAccessInterface;
  outputBoundary: NewMemberOutputBoundary;

  constructor(
    dao: NewMemberDataAccessInterface,
    outputBoundary: NewMemberOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async newMember(inputData: NewMemberInputData): Promise<void> {
    try {
      const members = await this.dao.newMember({ member: inputData });

      await this.outputBoundary.prepareForSuccessView(members);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "couldn't save the new member interactor",
      );
    }
  }
}
