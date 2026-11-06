import { BusinessRequested } from "@/entity/BusinessRequested";
import { NewBusinessRequestDAI } from "./NewBusinessRequestDAI";
import { NewBusinessRequestInputBoundary } from "./NewBusinessRequestInputBoundary";
import { NewBusinessRequestInputData } from "./NewBusinessRequestInputData";
import { NewBusinessRequestOutputBoundary } from "./NewBusinessRequestOutputBoundary";

export class NewBusinessRequestInteractor implements NewBusinessRequestInputBoundary {
  dao: NewBusinessRequestDAI;
  outputBoundary: NewBusinessRequestOutputBoundary;

  constructor(
    dao: NewBusinessRequestDAI,
    outputBoundary: NewBusinessRequestOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async newBusinessRequested(
    input: NewBusinessRequestInputData,
  ): Promise<void> {
    try {
      const result = await this.dao.newBusinessRequested({
        businessRequest: new BusinessRequested(input.id, input.name),
      });

      this.outputBoundary.prepareForSuccesView({
        businessesRequested: result.businessesRequested,
      });
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "coudln't retrieve the new business requested interactor error",
      );
    }
  }
}
