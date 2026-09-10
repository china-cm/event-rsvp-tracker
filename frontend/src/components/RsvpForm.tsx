"use client";

import { useState } from "react";
import { RsvpStatus } from "@/types/event";
import { submitRsvp } from "@/lib/api-client";

export interface RsvpFormProps {
  eventId: string;
  onSubmit?: (values: {
    name: string;
    email: string;
    status: RsvpStatus;
    guestCount: number;
  }) => Promise<void> | void;
}

const inputClasses =
  "mt-1.5 w-full rounded-md border border-ink/15 bg-paper-dim px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-soft/60 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30";

export function RsvpForm({ eventId, onSubmit }: RsvpFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<RsvpStatus>("yes");
  const [guestCount, setGuestCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (onSubmit) {
        await onSubmit({ name, email, status, guestCount });
      } else {
        await submitRsvp(eventId, {
          name,
          email,
          status,
          guest_count: guestCount,
        });
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-md border-l-4 border-pine bg-paper-dim p-5">
        <p className="font-display text-lg text-ink">You&apos;re on the list</p>
        <p className="mt-1 text-[15px] text-ink-soft">
          Thanks, {name || "friend"} — your reply has been recorded.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="rsvp-name"
          className="text-sm font-medium text-ink-soft"
        >
          Name
        </label>
        <input
          id="rsvp-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClasses}
        />
      </div>
      <div>
        <label
          htmlFor="rsvp-email"
          className="text-sm font-medium text-ink-soft"
        >
          Email
        </label>
        <input
          id="rsvp-email"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
        />
      </div>
      <div>
        <label
          htmlFor="rsvp-status"
          className="text-sm font-medium text-ink-soft"
        >
          Will you be there?
        </label>
        <div className="relative">
          <select
            id="rsvp-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as RsvpStatus)}
            className={`${inputClasses} appearance-none pr-10`}
          >
            <option value="yes">Yes, I&apos;ll be there</option>
            <option value="maybe">Maybe</option>
            <option value="no">Can&apos;t make it</option>
          </select>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
          >
            <path
              d="M5.5 8l4.5 4.5L14.5 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div>
        <label
          htmlFor="rsvp-guests"
          className="text-sm font-medium text-ink-soft"
        >
          Guests you&apos;re bringing
        </label>
        <input
          id="rsvp-guests"
          type="number"
          min={0}
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          className={inputClasses}
        />
      </div>
      {error && <p className="text-sm text-clay">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-brass px-4 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-brass/90 disabled:opacity-50"
      >
        {submitting ? "Sending your reply…" : "Send reply"}
      </button>
    </form>
  );
}
