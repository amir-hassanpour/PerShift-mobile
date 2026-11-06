import { LoadMembersPageDataAccessInterface } from "./LoadMembersPageDataAccessInterface";
import { LoadMembersPageInputBoundary } from "./LoadMembersPageInputBoundary";
import { LoadMembersPageInputData } from "./LoadMembersPageInputData";
import { LoadMembersPageOutputBoundary } from "./LoadMembersPageOutputBoundary";

export class LoadMembersPageInteractor implements LoadMembersPageInputBoundary {
  DAO: LoadMembersPageDataAccessInterface;
  outputBoundary: LoadMembersPageOutputBoundary;

  constructor(
    DAO: LoadMembersPageDataAccessInterface,
    outputBoundary: LoadMembersPageOutputBoundary,
  ) {
    this.DAO = DAO;
    this.outputBoundary = outputBoundary;
  }

  async loadMembers(inputData: LoadMembersPageInputData): Promise<void> {
    try {
      const members = await this.DAO.loadMembers({});

      this.outputBoundary.prepareForSuccsessView(members);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "coudln't load the members page in interactor",
      );
    }
  }
}
