export class Message {
  constructor(
    public readonly id: string,
    public readonly chat_id: string,
    public readonly content: string,
    public readonly time: Date,
    public readonly sender_id: string,
  ) {}
}
