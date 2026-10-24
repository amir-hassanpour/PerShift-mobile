import { Message } from "@/entity/Message";
import * as Crypto from "expo-crypto";
import { SendMessageDataAccessInterface } from "./SendMessageDataAccessInterface";
import { SendMessageInputBoundary } from "./SendMessageInputBoundary";
import { SendMessageInputData } from "./SendMessageInputData";
import { SendMessageOutputBoundary } from "./SendMessageOuputBoundary";

export class SendMessageInteractor implements SendMessageInputBoundary {
  dao: SendMessageDataAccessInterface;
  outputBoundary: SendMessageOutputBoundary;

  constructor(
    dao: SendMessageDataAccessInterface,
    outputBoundary: SendMessageOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  genUID(): string {
    const id = Crypto.randomUUID();
    return id;
  }

  async sendMessage(inputData: SendMessageInputData): Promise<void> {
    console.log(inputData);
    try {
      const messages = await this.dao.sendMessage(
        new Message(
          this.genUID(),
          inputData.chat_id,
          inputData.content,
          new Date(),
          inputData.sender_id,
        ),
      );

      this.outputBoundary.prepareForSuccessView(messages);
    } catch (error) {
      console.log(error);
      throw new Error("wasn't able to send the new message in the interactor");
    }
  }
}
