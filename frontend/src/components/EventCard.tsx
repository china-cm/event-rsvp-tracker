import Link from "next/link";
import { EventRecord } from "@/types/event";

export interface EventCardProps {
  event: EventRecord;
}

export function EventCard({ event }: EventCardProps) {
  const startsAt = new Date(event.starts_at);
  const when = startsAt.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="rounded-lg border-l-4 border-brass bg-paper p-5 sm:p-6">
      <h3 className="font-display text-xl text-ink">{event.title}</h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
        {event.location
          ? `${when} at ${event.location}`
          : `${when}`}
      </p>
      {event.description && (
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          {event.description}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link
          href={`/events/${event.id}`}
          className="font-medium text-brass underline decoration-brass/40 underline-offset-4 hover:decoration-brass"
        >
          View RSVP page
        </Link>
        <Link
          href={`/events/${event.id}/dashboard`}
          className="font-medium text-ink-soft underline decoration-ink-soft/30 underline-offset-4 hover:text-ink hover:decoration-ink-soft"
        >
          Manage
        </Link>
      </div>
    </div>
  );
}
