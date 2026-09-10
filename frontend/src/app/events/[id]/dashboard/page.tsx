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
    <main className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-paper sm:text-3xl">
          {event.title}
        </h1>
        <Link
          href={`/events/${event.id}`}
          className="mt-1 inline-block text-sm text-paper/60 underline decoration-paper/25 underline-offset-4 hover:text-paper/85"
        >
          View public RSVP page
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-3 divide-x divide-paper/15 rounded-lg bg-paper/5 py-5">
        <div className="text-center">
          <p className="font-display text-3xl text-paper">
            {attending.length}
          </p>
          <p className="mt-1 text-xs text-paper/60">Attending</p>
        </div>
        <div className="text-center">
          <p className="font-display text-3xl text-paper">{maybe.length}</p>
          <p className="mt-1 text-xs text-paper/60">Maybe</p>
        </div>
        <div className="text-center">
          <p className="font-display text-3xl text-paper">
            {totalGuests + attending.length}
          </p>
          <p className="mt-1 text-xs text-paper/60">Headcount</p>
        </div>
      </div>

      <div className="rounded-xl bg-paper p-6 sm:p-8">
        <h2 className="mb-1 font-display text-lg text-ink">Replies</h2>
        <RsvpList rsvps={rsvps} />
      </div>
    </main>
  );
}
