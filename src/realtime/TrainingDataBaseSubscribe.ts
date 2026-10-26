import { supabase } from "@/data-access/supabase/client";
import { Training } from "@/entity/Training";
import { NewTrainingController } from "@/interface-adapter/training-page/new-training/NewTrainingController";

export type props = {
  controller: NewTrainingController;
};

export class TrainingDataBaseSubscribe {
  private controller: NewTrainingController;

  constructor({ controller }: props) {
    this.controller = controller;
  }

  async subscribeChat() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error("Training subscribe wasn't successful user data error");
    }
    if (!user) {
      throw new Error("Couldn't retrieve user JWT");
    }

    const channel = supabase
      .channel("training_assignment")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "training_assignment",
          schema: "public",
          filter: `profile_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log("Full training event:", JSON.stringify(payload, null, 2));

          if (!payload.new.training_id) {
            console.error("Assignment event has no training_id:", payload);
            return;
          }
          try {
            console.log(payload.new, user.id);
            const { data, error } = await supabase
              .from("training")
              .select(
                ` id,
                name,
                progress,
                business_id,
                created_at`,
              )
              .eq("id", payload.new.training_id)
              .single();

            if (error) throw error;

            const newTraining = new Training(
              data.id,
              data.name,
              data.progress,
              data.business_id,
              new Date(data.created_at),
            );
            this.controller.newTraining({ training: newTraining });
          } catch (error) {
            throw error;
          }
        },
      )
      .subscribe((error) => {
        console.log("subscribed to new training");
      });
  }
}
