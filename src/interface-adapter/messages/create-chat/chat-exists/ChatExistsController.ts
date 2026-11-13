import { User } from "@/entity/User";
import { ChatExistsInteractor } from "@/usecase/messages/create-chat/chat_exists/ChatExistsInteractor";

export class ChatExistsController {
  interactor: ChatExistsInteractor;

  constructor(interactor: ChatExistsInteractor) {
    this.interactor = interactor;
  }

  async chatExists(input: { user: User }) {
    await this.interactor.chatExists(input);
  }
}
