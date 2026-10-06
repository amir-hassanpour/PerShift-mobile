import { DeclineBusinessRequestDataAccessInterface } from "./DeclineBusinessRequestDataAccessInterface";
import { DeclineBusinessRequestInputBoundary } from "./DeclineBusinessRequestInputBoundary";
import { DeclineBusinessRequestInputData } from "./DeclineBusinessRequestInputData";
import { DeclineBusinessRequestOutputBoundary } from "./DeclineBusinessRequestOutputBoundary";
import { DeclineBusinessRequestOutputData } from "./DeclineBusinessRequestOutputData";

export class DeclineBusinessRequestInteractor implements DeclineBusinessRequestInputBoundary {
  outputBoudnary: DeclineBusinessRequestOutputBoundary;
  DAO: DeclineBusinessRequestDataAccessInterface;

  constructor(
    outputBoudnary: DeclineBusinessRequestOutputBoundary,
    DAO: DeclineBusinessRequestDataAccessInterface,
  ) {
    this.outputBoudnary = outputBoudnary;
    this.DAO = DAO;
  }

  async declineBusinessRequest(
    inputData: DeclineBusinessRequestInputData,
  ): Promise<void> {
    try {
      const daoResult = await this.DAO.declineBusinessRequest({
        businessId: inputData.businessId,
      });

      const outputData: DeclineBusinessRequestOutputData = {
        businesses: [],
        shifts: [],
        businessRequested: daoResult.businessRequested,
      };

      this.outputBoudnary.prepareForSuccessView(outputData);
    } catch (error) {
      this.outputBoudnary.prepareForFailureView(
        "Failed to decline business request",
      );
    }
  }
}
