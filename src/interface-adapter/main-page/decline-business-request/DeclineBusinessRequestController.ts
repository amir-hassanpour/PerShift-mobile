import { DeclineBusinessRequestInputBoundary } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestInputBoundary";

export class DeclineBusinessRequestController {
  interactor: DeclineBusinessRequestInputBoundary;

  constructor(interactor: DeclineBusinessRequestInputBoundary) {
    this.interactor = interactor;
  }

  async declineBusinessRequest(businessId: string) {
    const inputData = {
      businessId: businessId,
    };

    await this.interactor.declineBusinessRequest(inputData);
  }
}
