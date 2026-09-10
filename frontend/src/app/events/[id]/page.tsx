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
  const when = startsAt.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="mx-auto max-w-lg px-6 py-10 sm:py-14">
      <div className="overflow-hidden rounded-xl bg-paper">
        <div className="p-6 sm:p-8">
          <h1 className="font-display text-2xl text-ink sm:text-3xl">
            {event.title}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            {event.location ? `${when} at ${event.location}` : when}
          </p>
          {event.description && (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              {event.description}
            </p>
          )}
        </div>

        <div className="relative h-0 border-t-2 border-dashed border-ink/15">
          <span
            aria-hidden
            className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
          />
          <span
            aria-hidden
            className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-ink"
          />
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="mb-5 font-display text-lg text-ink">
            Will you join us?
          </h2>
          <RsvpForm eventId={event.id} />
        </div>
      </div>
    </main>
  );
}
