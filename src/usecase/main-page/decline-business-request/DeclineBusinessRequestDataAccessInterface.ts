export type DeclineBusinessRequest = {
  businessId: string;
};

export interface DeclineBusinessRequestDataAccessInterface {
  declineBusinessRequest(
    declineBusinessRequest: DeclineBusinessRequest,
  ): Promise<void>;
}
