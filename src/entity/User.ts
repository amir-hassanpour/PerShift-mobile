export type UserProps = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: Date;
  avatarUrl?: string | null;
};

export class User {
  public readonly id: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly username: string;
  public readonly email: string;
  public readonly createdAt: Date;
  public readonly avatarUrl?: string | null;

  constructor(props: UserProps) {
    if (!props.firstName.trim()) {
      throw new Error("First name is required");
    }

    if (!props.lastName.trim()) {
      throw new Error("Last name is required");
    }

    if (props.username.trim().length < 3) {
      throw new Error("Username must contain at least 3 characters");
    }

    this.id = props.id;
    this.firstName = props.firstName.trim();
    this.lastName = props.lastName.trim();
    this.username = props.username.trim().toLowerCase();
    this.email = props.email.trim().toLowerCase();
    this.createdAt = props.createdAt;
    this.avatarUrl = props.avatarUrl ?? null;
  }
}
