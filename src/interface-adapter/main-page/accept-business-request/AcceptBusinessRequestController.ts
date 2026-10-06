import { AcceptBusinessRequestInputBoundary } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestInputBoundary";
import { AcceptBusinessRequestInputData } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestInputData";
import { AcceptBusinessRequestInteractor } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestInteractor";

export class AcceptBusinessRequestController {
  interactor: AcceptBusinessRequestInputBoundary;

  constructor(interactor: AcceptBusinessRequestInteractor) {
    this.interactor = interactor;
  }

  async acceptBusinessRequestController(businessID: string) {
    let InputData: AcceptBusinessRequestInputData = {
      businessId: businessID,
    };

    this.interactor.acceptBusinessRequest(InputData);
  }
}
