import { notFound } from "next/navigation";
import Link from "next/link";
import { RsvpList } from "@/components/RsvpList";
import { getSupabaseClient } from "@/lib/supabase";
import { EventRecord, RsvpRecord } from "@/types/event";

export const dynamic = "force-dynamic";

async function getEventWithRsvps(
  id: string
): Promise<{ event: EventRecord; rsvps: RsvpRecord[] } | null> {
  const supabase = getSupabaseClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (eventError || !event) return null;

  const { data: rsvps, error: rsvpError } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: true });

  if (rsvpError) return null;

  return { event, rsvps: rsvps ?? [] };
}

export default async function EventDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getEventWithRsvps(id);

  if (!result) notFound();

  const { event, rsvps } = result;
  const attending = rsvps.filter((r) => r.status === "yes");
  const maybe = rsvps.filter((r) => r.status === "maybe");
  const totalGuests = attending.reduce((sum, r) => sum + r.guest_count, 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {event.title}
          </h1>
          <Link
            href={`/events/${event.id}`}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            View public RSVP page
          </Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {attending.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Attending
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {maybe.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Maybe</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalGuests + attending.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total headcount
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        RSVPs
      </h2>
      <RsvpList rsvps={rsvps} />
    </main>
  );
}
