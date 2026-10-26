export class Training {
  id: string;
  name: string;
  progress: number;
  business_id: string;
  created_at: Date;

  constructor(
    id: string,
    name: string,
    progress: number,
    business_id: string,
    created_at: Date,
  ) {
    this.id = id;
    this.name = name;
    this.progress = progress;
    this.business_id = business_id;
    this.created_at = created_at;
  }
}
