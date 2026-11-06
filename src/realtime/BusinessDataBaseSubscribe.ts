import { supabase } from "@/data-access/supabase/client";
import { NewBusinessRequestController } from "@/interface-adapter/main-page/new-business-request/NewBusinessRequestController";
import { NewBusinessController } from "@/interface-adapter/main-page/new-business/NewBusinessController";

export type BusinessSubscribeProps = {
  controllerBusiness: NewBusinessController;
  controllerBusinessRequest: NewBusinessRequestController;
};

export class BusinessDataBaseSubscribe {
  readonly controllerBusiness: NewBusinessController;
  readonly controllerBusinessRequest: NewBusinessRequestController;

  constructor(props: BusinessSubscribeProps) {
    this.controllerBusiness = props.controllerBusiness;
    this.controllerBusinessRequest = props.controllerBusinessRequest;
  }

  async businessSubscribe() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!user) throw new Error("You must be signed in");

    const channel = supabase
      .channel(`business:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "business_role_assignment",
          schema: "public",
          filter: `profile_id=eq.${user.id}`,
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
          filter: `profile_id=eq.${user.id}`,
        },
        async (payload) => {
          await this.handleAssignment(payload.new);
        },
      )
      .subscribe((status, error) => {
        console.log("subscribed to business sttaus:", status);
        if (error) {
          throw error;
        }
      });
  }

  async handleAssignment(assignment: Record<string, unknown>) {
    const { data, error } = await supabase
      .from("business")
      .select(
        `
            id,
            business_name
            `,
      )
      .eq("id", assignment.business_name)
      .single();

    if (error) throw error;
    if (!data) throw new Error("the data wasn't retriece");

    if (assignment.role_accepted === "accepted") {
      await this.controllerBusiness.newBusiness({
        id: data.id,
        name: data.business_name,
        lastCheckedIn: new Date("1986-01-01T00:00:00.000Z"),
      });
    } else if (assignment.role_accepted === "pending") {
      await this.controllerBusinessRequest.newBusinessRequest({
        id: data.id,
        name: data.business_name,
      });
    }
  }
}
