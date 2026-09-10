import { notFound } from "next/navigation";
import { RsvpForm } from "@/components/RsvpForm";
import { getSupabaseClient } from "@/lib/supabase";
import { EventRecord } from "@/types/event";

export const dynamic = "force-dynamic";

async function getEvent(id: string): Promise<EventRecord | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export default async function EventRsvpPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) notFound();

  const startsAt = new Date(event.starts_at);

  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {event.title}
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {startsAt.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
        {event.location ? ` · ${event.location}` : ""}
      </p>
      {event.description && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {event.description}
        </p>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          RSVP
        </h2>
        <RsvpForm eventId={event.id} />
      </div>
    </main>
  );
}
