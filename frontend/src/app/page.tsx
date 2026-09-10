import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { getSupabaseClient } from "@/lib/supabase";
import { EventRecord } from "@/types/event";

export const dynamic = "force-dynamic";

async function getEvents(): Promise<EventRecord[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-paper sm:text-3xl">
          Your events
        </h1>
        <Link
          href="/events/new"
          className="shrink-0 rounded-md bg-brass px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brass/90"
        >
          Create event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-lg border border-dashed border-paper/20 p-8 text-center">
          <p className="text-[15px] text-paper/70">
            No events yet. Create one to get a link you can share with guests.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}
