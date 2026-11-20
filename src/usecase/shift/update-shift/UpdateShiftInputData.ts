
export type UpdateShiftInputData = {
  startTime: Date;
  endTime: Date;
  latitude: number | null;
  longitude: number | null;
  businessID: string;
  shiftID: string;
  description: string | null;
};
