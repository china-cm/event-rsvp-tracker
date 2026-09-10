"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createEvent } from "@/lib/api-client";

const inputClasses =
  "mt-1.5 w-full rounded-md border border-ink/15 bg-paper-dim px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-soft/60 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30";

export default function NewEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { event } = await createEvent({
        title,
        description,
        location,
        starts_at: new Date(startsAt).toISOString(),
      });
      router.push(`/events/${event.id}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-10 sm:py-14">
      <h1 className="mb-8 font-display text-2xl text-paper sm:text-3xl">
        Create an event
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="event-title"
            className="text-sm font-medium text-paper/70"
          >
            Title
          </label>
          <input
            id="event-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="event-date"
            className="text-sm font-medium text-paper/70"
          >
            Date &amp; time
          </label>
          <input
            id="event-date"
            required
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="event-location"
            className="text-sm font-medium text-paper/70"
          >
            Location
          </label>
          <input
            id="event-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="event-description"
            className="text-sm font-medium text-paper/70"
          >
            Description
          </label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={inputClasses}
          />
        </div>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-brass px-4 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-brass/90 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create event"}
        </button>
      </form>
    </main>
  );
}
