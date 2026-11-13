import { Chat } from "@/entity/Chat";
import { NewChatInteractor } from "@/usecase/messages/new-chat/NewChatInteractor";

export class NewChatController {
  interactor: NewChatInteractor;

  constructor(interactor: NewChatInteractor) {
    this.interactor = interactor;
  }

  async newChatController(input: { chat: Chat; self?: boolean }) {
    await this.interactor.newChat({
      business_id: input.chat.business_id,
      chat_id: input.chat.id,
      self: input.self,
    });
  }
}
