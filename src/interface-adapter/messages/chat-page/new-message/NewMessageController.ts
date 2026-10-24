import { Message } from "@/entity/Message";
import { NewMessageInteractor } from "@/usecase/messages/chat-page/new-message/NewMessageInteractor";

export class NewMessageController {
  interactor: NewMessageInteractor;

  constructor(interactor: NewMessageInteractor) {
    this.interactor = interactor;
  }
  newMessage(message: Message) {
    this.interactor.newMessage(message);
  }
}
