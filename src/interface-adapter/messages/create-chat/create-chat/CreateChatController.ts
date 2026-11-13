import { User } from "@/entity/User";
import { CreateChatInteractor } from "@/usecase/messages/create-chat/create-chat/CreateChatInteractor";

export class CreateChatController {
  interactor: CreateChatInteractor;

  constructor(interactor: CreateChatInteractor) {
    this.interactor = interactor;
  }

  async createChat(input: {
    isGroupChat: boolean;
    name: string;
    users: User[];
    businessID: string;
  }) {
    await this.interactor.createChat(input);
  }
}
