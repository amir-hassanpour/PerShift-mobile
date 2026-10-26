export type ModuleContentBlock =
  | { id: string; type: "text"; text: string }
  | { id: string; type: "image"; url: string; alt: string }
  | { id: string; type: "video"; url: string };

export class Module {
  id: string;
  header: string;
  content: ModuleContentBlock[];
  finished: boolean;
  order_number: number;
  training_id: string;

  constructor(
    id: string,
    header: string,
    content: ModuleContentBlock[],
    finished: boolean,
    order_number: number,
    training_id: string,
  ) {
    this.id = id;
    this.header = header;
    this.content = content;
    this.finished = finished;
    this.order_number = order_number;
    this.training_id = training_id;
  }
}
