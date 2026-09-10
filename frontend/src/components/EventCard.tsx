import Link from "next/link";
import { EventRecord } from "@/types/event";

export interface EventCardProps {
  event: EventRecord;
}

export function EventCard({ event }: EventCardProps) {
  const startsAt = new Date(event.starts_at);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {event.title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {startsAt.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
        {event.location ? ` · ${event.location}` : ""}
      </p>
      {event.description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {event.description}
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <Link
          href={`/events/${event.id}`}
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          View RSVP page
        </Link>
        <Link
          href={`/events/${event.id}/dashboard`}
          className="text-sm font-medium text-gray-600 hover:underline dark:text-gray-400"
        >
          Organizer dashboard
        </Link>
      </div>
    </div>
  );
}
