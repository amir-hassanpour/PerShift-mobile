import { supabase } from "@/data-access/supabase/client";
import { NewModuleController } from "@/interface-adapter/training-page/training-page/new-module/NewModuleController";

export type props = {
  controller: NewModuleController;
};

export class ModuleDataBaseSubscribe {
  private controller: NewModuleController;

  constructor({ controller }: props) {
    this.controller = controller;
  }

  async subscribeModules() {
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

    const channel = await supabase
      .channel("module_assignment")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "module_assignment",
          schema: "public",
          filter: `profile_id=eq.${user.id}`,
        },
        async (payload) => {
          try {
            const { data, error } = await supabase
              .from("module")
              .select(
                `
                id,
                header,
                content,
                finished,
                order_number,
                training_id`,
              )
              .eq("id", payload.new.module_id)
              .single();

            if (!data) throw new Error("coudldn't retriece the new module");
            if (error) throw error;

            console.log("new module");

            await this.controller.newModule({
              id: data.id,
              header: data.header,
              content: data.content,
              finished: data.finished,
              order_number: data.order_number,
              training_id: data.training_id,
            });
          } catch (error) {
            throw error;
          }
        },
      )
      .subscribe((error) => {
        console.log("module subscibe");
      });
  }
}
