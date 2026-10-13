import { Chat } from "@/entity/Chat";
import { NewChatController } from "@/interface-adapter/messages/new-chat/NewChatController";
import { supabase } from "../data-access/supabase/client";

export type props = {
  controller: NewChatController;
};

export class ChatDataBaseSubscribe {
  private controller: NewChatController;

  constructor({ controller }: props) {
    this.controller = controller;
  }

  async subscribeChat() {
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
      .channel(`chat_assignment:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "chat_assignment",
          schema: "public",
          filter: `profile_id=eq.(${user.id})`,
        },
        async (payload) => {
          console.log("new message recieved");
          try {
            const { data, error } = await supabase
              .from("chat_assignment")
              .select(
                `
            chat_id, 
            business_id,
            name
            `,
              )
              .eq("profile_id", user.id)
              .single();

            if (error) throw error;

            let chat = new Chat(data.chat_id, data.business_id, data.name);

            await this.controller.newChatController(chat);
          } catch (error) {
            throw error;
          }
        },
      )
      .subscribe((error) => {
        console.log("subscibed");
      });
  }
}
