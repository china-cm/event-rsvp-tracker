import { RsvpRecord } from "@/types/event";

export interface RsvpListProps {
  rsvps: RsvpRecord[];
}

const STATUS_LABEL: Record<RsvpRecord["status"], string> = {
  yes: "Attending",
  maybe: "Maybe",
  no: "Not attending",
};

const STATUS_BADGE: Record<RsvpRecord["status"], string> = {
  yes: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  maybe: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  no: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function RsvpList({ rsvps }: RsvpListProps) {
  if (rsvps.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No RSVPs yet.
      </p>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <th className="py-2 pr-4 font-medium">Name</th>
          <th className="py-2 pr-4 font-medium">Email</th>
          <th className="py-2 pr-4 font-medium">Status</th>
          <th className="py-2 pr-4 font-medium">Guests</th>
        </tr>
      </thead>
      <tbody>
        {rsvps.map((rsvp) => (
          <tr
            key={rsvp.id}
            className="border-b border-gray-100 dark:border-gray-900"
          >
            <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">
              {rsvp.name}
            </td>
            <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">
              {rsvp.email}
            </td>
            <td className="py-2 pr-4">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[rsvp.status]}`}
              >
                {STATUS_LABEL[rsvp.status]}
              </span>
            </td>
            <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">
              {rsvp.guest_count}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
