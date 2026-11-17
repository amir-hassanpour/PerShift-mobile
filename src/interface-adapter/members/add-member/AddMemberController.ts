import { Role } from "@/entity/Role";
import { AddMemberInteractor } from "@/usecase/members/add-member/AddMemberInteractor";

export class AddMemberController {
  constructor(private readonly addMemberInteractor: AddMemberInteractor) {}

  async addMember(input: { email: string; role: Role }): Promise<void> {
    return await this.addMemberInteractor.addMember(input);
  }
}
