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
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Events
        </h1>
        <Link
          href="/events/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No events yet. Create the first one to get started.
        </p>
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
