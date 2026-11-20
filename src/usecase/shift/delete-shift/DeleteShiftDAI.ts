
export type DeleteShiftInput = {
  shiftID: string;
};

export type DeleteShiftOutput = {};

export interface DeleteShiftDAI {
  deleteShift(input: DeleteShiftInput): Promise<DeleteShiftOutput>;
}
