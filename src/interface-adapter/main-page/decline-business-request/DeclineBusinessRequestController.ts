import { DeclineBusinessRequestInputBoundary } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestInputBoundary";

export class DeclineBusinessRequestController {
  interactor: DeclineBusinessRequestInputBoundary;

  constructor(interactor: DeclineBusinessRequestInputBoundary) {
    this.interactor = interactor;
  }

  declineBusinessRequest(businessId: string) {
    const inputData = {
      businessId: businessId,
    };

    this.interactor.declineBusinessRequest(inputData);
  }
}
