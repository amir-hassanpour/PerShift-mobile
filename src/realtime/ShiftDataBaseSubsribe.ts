import { DeleteShiftController } from "@/interface-adapter/shift/delete-shift/DeleteShiftController";
import { NewShiftController } from "@/interface-adapter/shift/new-shift/NewShiftController";
import { UpdateShiftController } from "@/interface-adapter/shift/update-shift/UpdateShiftController";
import { supabase } from "../data-access/supabase/client";

export type NewShift = {
  startTime: Date;
  endTime: Date;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  businessid: string;
  id: string;
};

export type Props = {
  controller: NewShiftController;
  controllerDelete: DeleteShiftController;
  controllerUpdate: UpdateShiftController;
};

export class ShiftDataBaseSubscribe {
  private controller: NewShiftController;
  private controllerDelete: DeleteShiftController;
  private controllerUpdate: UpdateShiftController;

  constructor({ controller, controllerDelete, controllerUpdate }: Props) {
    this.controller = controller;
    this.controllerDelete = controllerDelete;
    this.controllerUpdate = controllerUpdate;
  }

  async subscribeNewShift() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw authError;
    }

    if (!user) {
      throw new Error("You must be signed in");
    }

    const channel = supabase
      .channel(`shift_assignments:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "shift_assignment",
          filter: `profile_id=eq.${user.id}`,
        },
        async (payload) => {
          try {
            const { data, error } = await supabase
              .from("shift")
              .select(
                `
            id,
            start_time,
            end_time,
            latitude,
            longitude,
            business_id,
            description
          `,
              )
              .eq("id", payload.new.shift_id)
              .single();

            if (error) {
              throw error;
            }

            let shift: NewShift = {
              startTime: new Date(data.start_time),
              endTime: new Date(data.end_time),
              latitude: data.latitude === null ? null : Number(data.latitude),
              longitude:
                data.longitude === null ? null : Number(data.longitude),
              businessid: data.business_id,
              id: data.id,
              description: data.description,
            };

            await this.controller.newShiftController(shift);
          } catch (error) {
            console.error("Could not load the newly assigned shift:", error);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "shift_assignment",
          filter: `profile_id=eq.${user.id}`,
        },
        async (payload) => {
          try {
            if (payload.old.profile_id !== user.id) return;

            const shiftID = payload.old.shift_id;
            if (typeof shiftID !== "string") return;

            await this.controllerDelete.deleteShift({ shiftID });
          } catch (error) {
            console.error("Could not remove the unassigned shift:", error);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "shift",
        },
        async (payload) => {
          try {
            const shiftID = payload.old.id;
            if (typeof shiftID !== "string") return;

            await this.controllerDelete.deleteShift({ shiftID });
          } catch (error) {
            console.error("Could not remove the deleted shift:", error);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shift",
        },
        async (payload) => {
          try {
            const shift = payload.new;

            await this.controllerUpdate.updateShift({
              shiftID: shift.id,
              startTime: new Date(shift.start_time),
              endTime: new Date(shift.end_time),
              longitude:
                shift.longitude == null ? null : Number(shift.longitude),
              latitude: shift.latitude == null ? null : Number(shift.latitude),
              businessID: shift.business_id,
              description: shift.description,
            });
            console.log("eupdated");
          } catch (error) {
            console.error("Could not update the shift locally:", error);
          }
        },
      )
      .subscribe((status, error) => {
        if (error) {
          console.error("Shift subscription error:", error);
        }
      });
  }
}
