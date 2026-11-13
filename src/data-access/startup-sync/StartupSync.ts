import { Business } from "@/entity/Business";
import { Chat } from "@/entity/Chat";
import { Message } from "@/entity/Message";
import { Module } from "@/entity/Module";
import { Role } from "@/entity/Role";
import { Shift } from "@/entity/Shift";
import { Training } from "@/entity/Training";
import { User } from "@/entity/User";
import { BusinessRAMDisk } from "../business-shifts-data/BusinessRAMDisk";
import { BusinessShiftsRAMDisk } from "../business-shifts-data/shift/BusinessShiftsRAMDisk";
import { ChatsRAMDisk } from "../chats-messages-data/ChatsRAMDisk";
import { MessagesRAMDisk } from "../chats-messages-data/MessageRAMDisk";
import { MemberRAMDisk } from "../members/MemberRAMDisk";
import { supabase } from "../supabase/client";
import { ModuleRAMDisk } from "../trainings/trainings-data/ModuleRAMDisk";
import { TrainingsRAMDisk } from "../trainings/trainings-data/TrainingsRAMDisk";
import { RoleRAMDisk } from "../user-data/role/RoleRAMDisk";
import { UserRAMDisk } from "../user-data/UserRAMDisk";

export class StartupSync {
  async startupSync() {
    await this.syncUser();

    const businessID = await this.syncBusinesses();

    if (!businessID) return;

    await this.syncChatsMessages(businessID);
    await this.syncMembers(businessID);
    await this.syncShifts(businessID);
    await this.syncTrainingsModules(businessID);
    await this.syncRole(businessID);
  }

  async syncBusinesses(): Promise<string | null> {
    const disk = new BusinessRAMDisk();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const businesses = await disk.getBusinesses();

    const previousActiveID = businesses[0]?.id;
    const updatedBusinesses: Business[] = [];

    for (const business of businesses) {
      const { data: assignment, error: assignmentError } = await supabase
        .from("business_role_assignment")
        .select("business_name")
        .eq("profile_id", user.id)
        .eq("business_name", business.id)
        .eq("role_accepted", "accepted")
        .maybeSingle();

      if (assignmentError) throw assignmentError;
      if (!assignment) continue;

      const { data: businessData, error: businessError } = await supabase
        .from("business")
        .select("id, name:business_name")
        .eq("id", assignment.business_name)
        .maybeSingle();

      if (businessError) throw businessError;

      if (!businessData) {
        throw new Error(`Could not retrieve business ${business.id}`);
      }

      updatedBusinesses.push(
        new Business(
          businessData.id,
          businessData.name,
          business.lastCheckedIn,
        ),
      );

      if (updatedBusinesses.length >= 5) break;
    }

    if (updatedBusinesses.length < 5) {
      const existingIDs = new Set(
        updatedBusinesses.map((business) => business.id),
      );

      let query = supabase
        .from("business_role_assignment")
        .select("business_name")
        .eq("profile_id", user.id)
        .eq("role_accepted", "accepted");

      for (const id of existingIDs) {
        query = query.neq("business_name", id);
      }

      const { data: assignments, error: assignmentsError } = await query
        .order("business_name", { ascending: true })
        .limit(5 - updatedBusinesses.length);

      if (assignmentsError) throw assignmentsError;

      for (const assignment of assignments ?? []) {
        if (existingIDs.has(assignment.business_name)) continue;

        const { data: businessData, error: businessError } = await supabase
          .from("business")
          .select("id, name")
          .eq("id", assignment.business_name)
          .maybeSingle();

        if (businessError) throw businessError;
        if (!businessData) {
          throw new Error(
            `Could not retrieve business ${assignment.business_name}`,
          );
        }

        updatedBusinesses.push(
          new Business(
            businessData.id,
            businessData.name,
            new Date("1986-01-01T00:00:00.000Z"),
          ),
        );

        existingIDs.add(businessData.id);
      }
    }

    if (
      updatedBusinesses.length > 0 &&
      !updatedBusinesses.some((business) => business.id === previousActiveID)
    ) {
      const next = updatedBusinesses[0];

      updatedBusinesses[0] = new Business(next.id, next.name, new Date());
    }

    await new BusinessRAMDisk().deleteAllBusinesses();

    for (const business of updatedBusinesses) {
      await disk.saveBusiness(business);
    }
    return updatedBusinesses[0]?.id ?? null;
  }

  async syncChatsMessages(businessID: string): Promise<void> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    type ChatSnapshot = {
      chat: Chat;
      messages: Message[];
    };

    const snapshots: ChatSnapshot[] = [];
    const pageSize = 100;
    let offset = 0;

    // Fetch every accessible chat before choosing the newest five.
    const { data: chats, error } = await supabase
      .from("chat")
      .select("id, business_id, self, name:chat_name, last_message_at, dm")
      .eq("business_id", businessID)
      .order("last_message_at", {
        ascending: false,
        nullsFirst: false,
      })
      .order("id", { ascending: true })
      .limit(5);

    if (error) throw error;

    if (!chats) throw new Error("Could not retrieve chats");

    for (const chatData of chats) {
      const { data: chatAssignment, error: error2 } = await supabase
        .from("chat_assignment")
        .select("profile_id")
        .eq("chat_id", chatData.id)
        .neq("profile_id", user.id)
        .limit(3);

      if (error2) throw error2;
      if (!chatAssignment) throw new Error("chat not found");

      const names = [];

      for (const ids of chatAssignment) {
        const { data: profile, error: error3 } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("profile_id", ids.profile_id)
          .limit(1);

        if (error3) throw error3;
        if (!profile)
          throw new Error("couldn't retrieve profile to construct chat name");

        names.push(profile[0].first_name + " " + profile[0].last_name);
      }
      chatData.name = names.join(", ");

      if (chatData.self === true) {
        const curUser = await new UserRAMDisk().getCurrentUser();

        if (!curUser) throw new Error("Current user is not save on disk");
        chatData.name = curUser.firstName + " " + curUser.lastName;
      }

      const {
        data: messageData,
        error: messagesError,
        count,
      } = await supabase
        .from("message")
        .select("id, chat_id, content, time, sender_id", { count: "exact" })
        .eq("chat_id", chatData.id)
        .order("time", { ascending: false })
        .order("id", { ascending: true })
        .limit(10);

      if (messagesError) throw messagesError;
      if (!messageData) {
        throw new Error(`Could not retrieve messages for ${chatData.id}`);
      }

      const messages = messageData.map((row) => {
        const time = new Date(row.time);

        if (!Number.isFinite(time.getTime())) {
          throw new Error(`Invalid date for message ${row.id}`);
        }

        return new Message(
          row.id,
          row.chat_id,
          row.content,
          time,
          row.sender_id,
        );
      });

      const newestMessage = messages[0];

      snapshots.push({
        chat: new Chat(
          chatData.id,
          chatData.business_id,
          chatData.name,
          newestMessage?.time,
          count ?? 0,
          newestMessage?.content ?? "",
        ),
        messages,
      });
    }

    offset += chats.length;

    // Chats with messages come first, newest activity first.
    snapshots.sort((a, b) => {
      const aTime = a.chat.lastTextedAt?.getTime();
      const bTime = b.chat.lastTextedAt?.getTime();

      if (aTime === undefined && bTime !== undefined) return 1;
      if (aTime !== undefined && bTime === undefined) return -1;

      if (aTime !== undefined && bTime !== undefined) {
        const difference = bTime - aTime;
        if (difference !== 0) return difference;
      }

      return a.chat.id.localeCompare(b.chat.id);
    });

    const selected = snapshots.slice(0, 5);

    const chatsDisk = new ChatsRAMDisk();
    const messagesDisk = new MessagesRAMDisk();

    await new ChatsRAMDisk().deleteAllChats();
    await new MessagesRAMDisk().deleteAllMessages();

    for (const { chat, messages } of selected) {
      await chatsDisk.saveChat(chat);

      for (const message of messages) {
        await messagesDisk.saveMessage(message);
      }
    }
  }

  async syncShifts(businessID: string): Promise<void> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const { data, error } = await supabase
      .from("shift")
      .select(
        `
      id,
      business_id,
      start_time,
      end_time,
      latitude,
      longitude,
      description
    `,
      )
      .eq("business_id", businessID)
      .order("start_time", { ascending: true })
      .order("id", { ascending: true })
      .limit(5);

    if (error) throw error;
    if (!data) throw new Error("Could not retrieve shifts");

    const parseCoordinate = (value: string | null): number | null => {
      if (value === null || value.trim() === "") return null;

      const number = Number(value);

      if (!Number.isFinite(number)) {
        throw new Error(`Invalid coordinate: ${value}`);
      }

      return number;
    };

    // Validate everything before saving.
    const shifts = data.map((row) => {
      const startTime = new Date(row.start_time);
      const endTime = new Date(row.end_time);

      if (
        !Number.isFinite(startTime.getTime()) ||
        !Number.isFinite(endTime.getTime())
      ) {
        throw new Error(`Shift ${row.id} has an invalid date`);
      }

      return new Shift(
        startTime,
        endTime,
        parseCoordinate(row.latitude),
        parseCoordinate(row.longitude),
        row.business_id,
        row.id,
        row.description ?? "",
      );
    });

    const disk = new BusinessShiftsRAMDisk();

    await new BusinessShiftsRAMDisk().deleteAllShifts();

    for (const shift of shifts) {
      await disk.saveShift(shift);
    }
  }

  async syncMembers(businessID: string): Promise<void> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
      profile_id,
      first_name,
      last_name,
      username,
      email,
      created_at,
      avatar_url,
      membership:business_role_assignment!inner(
        profile_id
      )
    `,
      )
      .eq("membership.business_name", businessID)
      .eq("membership.role_accepted", "accepted")
      .order("first_name", { ascending: true })
      .order("last_name", { ascending: true })
      .order("profile_id", { ascending: true })
      .limit(10);

    if (error) throw error;
    if (!data) throw new Error("Could not retrieve members");

    // Construct and validate all members before saving.
    const members = data.map((row) => {
      const createdAt = new Date(row.created_at);

      if (!Number.isFinite(createdAt.getTime())) {
        throw new Error(
          `Member ${row.profile_id} has an invalid created_at date`,
        );
      }

      return new User({
        id: row.profile_id,
        firstName: row.first_name,
        lastName: row.last_name,
        username: row.username,
        email: row.email,
        createdAt,
        avatarUrl: row.avatar_url,
      });
    });

    const disk = new MemberRAMDisk();

    await new MemberRAMDisk().deleteAllMembers();

    for (const member of members) {
      await disk.saveMember(member);
    }
  }

  async syncTrainingsModules(businessID: string): Promise<void> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const { data, error } = await supabase
      .from("training")
      .select(
        `
      id,
      name,
      progress,
      business_id,
      created_at,
      assignment:training_assignment!inner(
        profile_id
      )
    `,
      )
      .eq("business_id", businessID)
      .eq("assignment.profile_id", user.id)
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .limit(5);

    if (error) throw error;
    if (!data) throw new Error("Could not retrieve trainings");

    const isContentBlock = (
      value: unknown,
    ): value is Module["content"][number] => {
      if (
        typeof value !== "object" ||
        value === null ||
        !("id" in value) ||
        typeof value.id !== "string" ||
        !("type" in value)
      ) {
        return false;
      }

      switch (value.type) {
        case "text":
          return "text" in value && typeof value.text === "string";

        case "image":
          return (
            "url" in value &&
            typeof value.url === "string" &&
            "alt" in value &&
            typeof value.alt === "string"
          );

        case "video":
          return "url" in value && typeof value.url === "string";

        default:
          return false;
      }
    };

    const snapshots: {
      training: Training;
      modules: Module[];
    }[] = [];

    // Fetch and validate everything before saving.
    for (const row of data) {
      const createdAt = new Date(row.created_at);

      if (!Number.isFinite(createdAt.getTime())) {
        throw new Error(`Training ${row.id} has an invalid created_at date`);
      }

      const training = new Training(
        row.id,
        row.name,
        row.progress,
        row.business_id,
        createdAt,
      );

      const { data: moduleData, error: moduleError } = await supabase
        .from("module")
        .select(
          `
        id,
        header,
        content,
        finished,
        order_number,
        training_id,
        assignment:module_assignment!inner(
          profile_id
        )
      `,
        )
        .eq("training_id", training.id)
        .eq("assignment.profile_id", user.id)
        .order("order_number", { ascending: true })
        .order("id", { ascending: true })
        .limit(3);

      if (moduleError) throw moduleError;
      if (!moduleData) {
        throw new Error(
          `Could not retrieve modules for training ${training.id}`,
        );
      }

      const modules = moduleData.map((moduleRow) => {
        const content: unknown = moduleRow.content;

        if (!Array.isArray(content) || !content.every(isContentBlock)) {
          throw new Error(`Module ${moduleRow.id} has invalid content`);
        }

        return new Module(
          moduleRow.id,
          moduleRow.header,
          content,
          moduleRow.finished,
          moduleRow.order_number,
          moduleRow.training_id,
        );
      });

      snapshots.push({ training, modules });
    }

    const trainingDisk = new TrainingsRAMDisk();
    const moduleDisk = new ModuleRAMDisk();

    await new TrainingsRAMDisk().deleteAllTrainings();
    await new ModuleRAMDisk().deleteAllModules();

    // Modules are only retained when their training is cached.
    for (const { training } of snapshots) {
      await trainingDisk.saveTraining(training);
    }

    for (const { modules } of snapshots) {
      for (const module of modules) {
        await moduleDisk.saveModule(module);
      }
    }
  }

  async syncUser(): Promise<void> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "profile_id, first_name, last_name, username, email, created_at, avatar_url",
      )
      .eq("profile_id", user.id)
      .single();

    if (error) {
      throw error;
    }
    if (!data) throw new Error("User information wan't retrieved");

    await new UserRAMDisk().saveCurrentUser(
      new User({
        id: data.profile_id,
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.username,
        email: data.email,
        createdAt: new Date(data.created_at),
        avatarUrl: data.avatar_url ?? null,
      }),
    );
  }

  async syncRole(businessID: string): Promise<void> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in");

    const { data: assignment, error: assignmentError } = await supabase
      .from("business_role_assignment")
      .select("role_id")
      .eq("profile_id", user.id)
      .eq("business_name", businessID)
      .eq("role_accepted", "accepted")
      .maybeSingle();

    if (assignmentError) throw assignmentError;

    const disk = new RoleRAMDisk();

    if (!assignment) {
      await disk.deleteBusinessRoles(businessID);
      return;
    }

    const { data, error } = await supabase
      .from("roles")
      .select(
        `
      id,
      role_name,
      business_id,
      can_invite_members,
      can_create_shifts,
      can_view_assigned_members_hours,
      owner
    `,
      )
      .eq("id", assignment.role_id)
      .eq("business_id", businessID)
      .single();

    if (error) throw error;

    const role = new Role({
      id: data.id,
      roleName: data.role_name,
      businessID: data.business_id,
      canInviteMembers: data.can_invite_members,
      canCreateShifts: data.can_create_shifts,
      canViewAssignedMembersHours: data.can_view_assigned_members_hours,
      owner: data.owner,
    });

    await disk.deleteBusinessRoles(businessID);
    await disk.saveRole(role);
  }
}
