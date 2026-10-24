import { Chat } from "@/entity/Chat";
import { NewChatInteractor } from "@/usecase/messages/new-chat/NewChatInteractor";

export class NewChatController {
  interactor: NewChatInteractor;

  constructor(interactor: NewChatInteractor) {
    this.interactor = interactor;
  }

  async newChatController(chat: Chat) {
    await this.interactor.newChat({
      business_id: chat.business_id,
      chat_id: chat.id,
    });
  }
}
