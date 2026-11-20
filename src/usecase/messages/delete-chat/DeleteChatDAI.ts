export type DeleteChatInput = {
  chatID: string;
};

export type DeleteChatOutput = {};

export interface DeleteChatDAI {
  deleteChat(input: DeleteChatInput): Promise<DeleteChatOutput>;
}
