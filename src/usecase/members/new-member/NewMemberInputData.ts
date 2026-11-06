export type NewMemberInputData = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: Date;
  avatarUrl?: string | null;
};
