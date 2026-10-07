export type NewShiftInputData = {
  startTime: Date;
  endTime: Date;
  latitude: number | null;
  longitude: number | null;
  description?: string;
  businessid: string;
  id: string;
};
