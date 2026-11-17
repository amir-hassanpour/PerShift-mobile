export interface AddMemberOutputBoundary {
  prepareForSuccessView(): void;

  prepareForFailureView(error: Error): void;
}
