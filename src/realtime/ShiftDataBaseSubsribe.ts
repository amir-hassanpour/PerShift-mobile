import { supabase } from "../data-access/supabase/client";

export type NewShift = {
  startTime: Date;
  endTime: Date;
  latitude: number | null;
  longitude: number | null;
  description?: string;
  businessid: string;
  id: string;
};

export class ShiftDataBaseSubscribe {
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
      .channel(`shift-assignments:${user.id}`)
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
            description,
            business_id
          `,
              )
              .eq("id", payload.new.shift_id)
              .single();

            if (error) throw error;

            let shift: NewShift = {
              startTime: new Date(data.start_time),
              endTime: new Date(data.end_time),
              latitude: data.latitude === null ? null : Number(data.latitude),
              longitude:
                data.longitude === null ? null : Number(data.longitude),
              description: data.description ?? "",
              businessid: data.business_id,
              id: data.id,
            };
          } catch (error) {
            console.error("Could not load the newly assigned shift:", error);
          }
        },
      )
      .subscribe();
  }
}
