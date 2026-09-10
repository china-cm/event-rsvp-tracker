import { RsvpRecord } from "@/types/event";

export interface RsvpListProps {
  rsvps: RsvpRecord[];
}

const STATUS_LABEL: Record<RsvpRecord["status"], string> = {
  yes: "Attending",
  maybe: "Maybe",
  no: "Not attending",
};

const STATUS_DOT: Record<RsvpRecord["status"], string> = {
  yes: "bg-pine",
  maybe: "bg-brass",
  no: "bg-ink-soft/50",
};

export function RsvpList({ rsvps }: RsvpListProps) {
  if (rsvps.length === 0) {
    return (
      <p className="text-[15px] text-ink-soft">
        No replies yet — they&apos;ll show up here as guests respond.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-ink/10">
      {rsvps.map((rsvp) => (
        <li
          key={rsvp.id}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{rsvp.name}</p>
            <p className="truncate text-sm text-ink-soft">{rsvp.email}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <span
              aria-hidden
              className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_DOT[rsvp.status]}`}
            />
            <span>
              {STATUS_LABEL[rsvp.status]}
              {rsvp.guest_count > 0 &&
                ` with ${rsvp.guest_count} guest${rsvp.guest_count > 1 ? "s" : ""}`}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
