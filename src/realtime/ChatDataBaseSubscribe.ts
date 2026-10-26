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
          filter: `profile_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log("new message recieved");
          try {
            const { data, error } = await supabase
              .from("chat")
              .select(
                `
            id, 
            business_id,
            chat_name
            `,
              )
              .eq("id", payload.new.chat_id)
              .single();

            if (error) throw error;

            let chat = new Chat(data.id, data.business_id, data.chat_name);

            await this.controller.newChatController(chat);
          } catch (error) {
            throw error;
          }
        },
      )
      .subscribe((error) => {
        console.log("subscibed to new chats");
      });
  }
}
