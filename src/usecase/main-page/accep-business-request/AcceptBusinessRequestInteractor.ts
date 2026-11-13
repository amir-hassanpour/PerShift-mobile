import {
  AcceptBusinessRequestDataAccessInterface,
  Acceptinput,
} from "./AcceptBusinessRequestDataAccessInterface";
import { AcceptBusinessRequestInputBoundary } from "./AcceptBusinessRequestInputBoundary";
import { AcceptBusinessRequestOutputBoundary } from "./AcceptBusinessRequestOutputBoundary";

export class AcceptBusinessRequestInteractor implements AcceptBusinessRequestInputBoundary {
  outputBoundary: AcceptBusinessRequestOutputBoundary;
  DAO: AcceptBusinessRequestDataAccessInterface;

  constructor(
    outputBoundary: AcceptBusinessRequestOutputBoundary,
    DAO: AcceptBusinessRequestDataAccessInterface,
  ) {
    this.outputBoundary = outputBoundary;
    this.DAO = DAO;
  }

  async acceptBusinessRequest(input: Acceptinput): Promise<void> {
    try {
      const output = await this.DAO.acceptBusinessRequest(input);
      await this.outputBoundary.prepareForSuccessView({
        shifts: output.shifts,
        businesses: output.businesses,
        requestedBusinesses: output.requestedBusinesses,
        role: output.role,
      });
    } catch (error) {
      await this.outputBoundary.prepareForFailureView(error as Error);
    }
  }
}
