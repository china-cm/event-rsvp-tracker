import {
  CreateEventInput,
  CreateRsvpInput,
  EventRecord,
  RsvpRecord,
} from "@/types/event";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error ?? `Request to ${path} failed with ${res.status}`);
  }

  return body as T;
}

export function listEvents(): Promise<{ events: EventRecord[] }> {
  return request("/api/events");
}

export function createEvent(
  input: CreateEventInput
): Promise<{ event: EventRecord }> {
  return request("/api/events", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listRsvps(
  eventId: string
): Promise<{ rsvps: RsvpRecord[] }> {
  return request(`/api/events/${eventId}/rsvps`);
}

export function submitRsvp(
  eventId: string,
  input: CreateRsvpInput
): Promise<{ rsvp: RsvpRecord }> {
  return request(`/api/events/${eventId}/rsvps`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
