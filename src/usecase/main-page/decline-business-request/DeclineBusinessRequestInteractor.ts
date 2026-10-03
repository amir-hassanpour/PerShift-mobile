import { DeclineBusinessRequestDataAccessInterface } from "./DeclineBusinessRequestDataAccessInterface";
import { DeclineBusinessRequestInputBoundary } from "./DeclineBusinessRequestInputBoundary";
import { DeclineBusinessRequestInputData } from "./DeclineBusinessRequestInputData";

export class DeclineBusinessRequestInteractor implements DeclineBusinessRequestInputBoundary {
  outputBoudnary: DeclineBusinessRequestInputBoundary;
  DAO: DeclineBusinessRequestDataAccessInterface;

  constructor(
    outputBoudnary: DeclineBusinessRequestInputBoundary,
    DAO: DeclineBusinessRequestDataAccessInterface,
  ) {
    this.outputBoudnary = outputBoudnary;
    this.DAO = DAO;
  }

  async declineBusinessRequest(
    inputData: DeclineBusinessRequestInputData,
  ): Promise<void> {
    const daoResult = await this.DAO.declineBusinessRequest({
      businessId: inputData.businessId,
    });
  }
}
