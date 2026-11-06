import { Business } from "@/entity/Business";
import { NewBusinessDAI } from "./NewBusinessDAI";
import { NewBusinessInputBoundary } from "./NewBusinessInputBoundary";
import { NewBusinessInputData } from "./NewBusinessInputData";
import { NewBusinessOutputBoundary } from "./NewBusinessOutputBoundary";

export class NewBusinessInteractor implements NewBusinessInputBoundary {
  dao: NewBusinessDAI;
  outputBoundary: NewBusinessOutputBoundary;

  constructor(dao: NewBusinessDAI, outputBoundary: NewBusinessOutputBoundary) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async newBusiness(input: NewBusinessInputData): Promise<void> {
    try {
      const result = await this.dao.newBusiness({
        business: new Business(input.id, input.name, input.lastCheckedIn),
      });

      await this.outputBoundary.prepareForSuccessView({
        busiensses: result.businesses,
      });
    } catch (error) {
      await this.outputBoundary.prepareForFailureView(
        "Couldn't add new business interactor error",
      );
    }
  }
}
