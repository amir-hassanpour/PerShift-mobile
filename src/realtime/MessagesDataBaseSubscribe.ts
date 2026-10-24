import { Message } from "@/entity/Message";
import { NewMessageController } from "@/interface-adapter/messages/chat-page/new-message/NewMessageController";
import { supabase } from "../data-access/supabase/client";

export type props = {
  controller: NewMessageController;
};

export class MessagesDataBaseSubscribe {
  private controller: NewMessageController;

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

    const { data, error } = await supabase
      .from("chat_assignment")
      .select("chat_id")
      .eq("profile_id", user.id);

    if (error) {
      throw error;
    }

    const chatIDs = (data ?? []).map((row) => row.chat_id);

    const channel = supabase
      .channel(`message:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "message",
          schema: "public",
          filter: `chat_id=in.(${chatIDs.join(",")})`,
        },
        async (payload) => {
          console.log("new message recieved");
          try {
            const { data, error } = await supabase
              .from("message")
              .select(
                `
            id, 
            chat_id,
            content,
            time, 
            sender_id
            `,
              )
              .eq("id", payload.new.id)
              .single();

            if (error) throw error;

            let message = new Message(
              data.id,
              data.chat_id,
              data.content,
              new Date(data.time),
              data.sender_id,
            );
            console.log("subscibed");

            await this.controller.newMessage(message);
          } catch (error) {
            throw error;
          }
        },
      )
      .subscribe((error) => {
        console.log("subscibed");
      });

    if (error) {
      throw error;
    }

    // void sendTestMessage();
  }
}
// let testMessageAttempted = false;

// async function sendTestMessage() {
//   if (testMessageAttempted) return;
//   testMessageAttempted = true;

//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser();

//   if (!user) {
//     throw new Error("what the fuck");
//   }

//   const { error } = await supabase.from("message").insert({
//     chat_id: "7e87556e-541a-4bd5-a0d0-7987229e3cbc",
//     content: "Testing my message subscription!",
//     time: new Date().toISOString(),
//     sender_id: user.id,
//   });

//   if (error) console.error("Test insert failed:", error);
// }
