import { SendMessageInteractor } from "@/usecase/messages/chat-page/send-message/SendMessageInteractor";

export class SendMessageController {
  interactor: SendMessageInteractor;

  constructor(interactor: SendMessageInteractor) {
    this.interactor = interactor;
  }

  async sendMessage(inputData: {
    content: string;
    chat_id: string;
    sender_id: string;
  }) {
    await this.interactor.sendMessage(inputData);
  }
}
