import { Chat } from "@/entity/Chat";
import * as Crypto from "expo-crypto";
import { CreateChatDAI } from "./CreateChatDAI";
import { CreateChatInputBoundary } from "./CreateChatInputBoundary";
import { CreateChatInputData } from "./CreateChatInputData";
import { CreateChatOutputBoundary } from "./CreateChatOutputBoundary";

export class CreateChatInteractor implements CreateChatInputBoundary {
  dao: CreateChatDAI;
  outputBoundary: CreateChatOutputBoundary;

  constructor(dao: CreateChatDAI, outputBoundary: CreateChatOutputBoundary) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async createChat(input: CreateChatInputData): Promise<void> {
    try {
      if (input.users.length < 2) {
        this.outputBoundary.prepareForMinimumUserRequirementFailure();
        return;
      }

      const newChat = new Chat(
        Crypto.randomUUID(),
        input.businessID,
        input.name,
      );
      const result = await this.dao.createChat({
        isGroupChat: input.isGroupChat,
        users: input.users,
        chat: newChat,
      });
      this.outputBoundary.preparepForSuccessView({
        chat: newChat,
        chats: result.chats,
      });
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Create chat failed interactor error.",
      );
    }
  }
}
