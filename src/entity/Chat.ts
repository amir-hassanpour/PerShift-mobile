export class Chat {
  id: string;
  lastText: string | "" = "";
  name: string;
  lastTextedAt: Date;
  messageCount: number = 0;

  constructor(
    id: string,
    lastText: string,
    name: string,
    lastTextedAt: Date,
    messageCount: number,
  ) {
    this.id = id;
    this.lastText = lastText;
    this.name = name;
    this.lastTextedAt = lastTextedAt;
    this.messageCount = messageCount;
  }
}
