import { supabase } from "@/data-access/supabase/client";
import { NewMemberController } from "@/interface-adapter/members/new-member/NewMemberController";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type MemberSubscribeProps = {
  businessID: string;
  controller: NewMemberController;
};

export class MemberDataBaseSubscribe {
  private readonly controller: NewMemberController;
  private readonly businessID: string;

  private channel: RealtimeChannel | null = null;
  private starting: Promise<void> | null = null;

  constructor({ controller, businessID }: MemberSubscribeProps) {
    this.controller = controller;
    this.businessID = businessID;
  }

  // Keeps your existing method name so current callers still work.
  async membetSubscribe(): Promise<void> {
    if (this.starting) {
      await this.starting;
      return;
    }

    if (this.channel) return;

    this.starting = this.startSubscription();

    try {
      await this.starting;
    } finally {
      this.starting = null;
    }
  }

  private async startSubscription(): Promise<void> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    this.channel = supabase
      .channel(`members:${this.businessID}:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "business_role_assignment",
          schema: "public",
          filter: `business_name=eq.${this.businessID}`,
        },
        async (payload) => {
          await this.handleAssignment(payload.new);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          table: "business_role_assignment",
          schema: "public",
          filter: `business_name=eq.${this.businessID}`,
        },
        async (payload) => {
          await this.handleAssignment(payload.new);
        },
      )
      .subscribe((status, error) => {
        if (error) {
          throw error;
        }
      });
  }

  private async handleAssignment(
    assignment: Record<string, unknown>,
  ): Promise<void> {
    try {
      // Handles accepted inserts and invitations that become accepted.
      if (assignment.role_accepted !== "accepted") return;

      const profileID = assignment.profile_id;

      if (typeof profileID !== "string" || !profileID) {
        throw new Error("Assignment is missing a valid profile_id");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          profile_id,
          first_name,
          last_name,
          email,
          created_at,
          username,
          avatar_url
        `,
        )
        .eq("profile_id", profileID)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Member profile was not found");

      const createdAt = new Date(data.created_at);

      if (!Number.isFinite(createdAt.getTime())) {
        throw new Error("Member has an invalid created_at date");
      }

      await this.controller.newMember({
        id: data.profile_id,
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.username,
        email: data.email,
        createdAt,
        avatarUrl: data.avatar_url,
      });
    } catch (error) {
      console.error("Could not handle member assignment:", error);
    }
  }

  async unsubscribe(): Promise<void> {
    if (this.starting) {
      try {
        await this.starting;
      } catch {
        return;
      }
    }

    if (!this.channel) return;

    const channel = this.channel;
    this.channel = null;

    await supabase.removeChannel(channel);
  }
}
