export class Chat {
  id: string;
  business_id: string;
  name: string;
  lastText: string;
  lastTextedAt: Date | undefined;
  messageCount: number;

  constructor(id: string, business_id: string, name: string);

  constructor(
    id: string,
    business_id: string,
    name: string,
    lastTextedAt: Date | undefined,
    messageCount: number,
    lastText: string,
  );

  constructor(
    id: string,
    business_id: string,
    name: string,
    lastTextedAt: Date | undefined = undefined,
    messageCount: number = 0,
    lastText: string = "",
  ) {
    this.id = id;
    this.business_id = business_id;
    this.name = name;
    this.lastTextedAt = lastTextedAt;
    this.messageCount = messageCount;
    this.lastText = lastText;
  }
}
