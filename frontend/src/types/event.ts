export type RsvpStatus = "yes" | "no" | "maybe";

export interface EventRecord {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  created_at: string;
}

export interface RsvpRecord {
  id: string;
  event_id: string;
  name: string;
  email: string;
  status: RsvpStatus;
  guest_count: number;
  created_at: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  starts_at: string;
}

export interface CreateRsvpInput {
  name: string;
  email: string;
  status: RsvpStatus;
  guest_count?: number;
}
