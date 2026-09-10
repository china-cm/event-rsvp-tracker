/**
 * Pact consumer contract test.
 *
 * Exercises the frontend's API client (src/lib/api-client.ts) against a Pact
 * mock provider, then writes the resulting contract to backend/contracts/pacts.
 * The backend provider verification step (backend/contracts/verify-provider.ts)
 * replays these interactions against the real Next.js API routes.
 *
 * Run with: npm run test:contract:consumer
 */
import path from "node:path";
import { PactV3, MatchersV3 } from "@pact-foundation/pact";

const { like, string, uuid } = MatchersV3;

const provider = new PactV3({
  consumer: "event-rsvp-frontend",
  provider: "event-rsvp-api",
  dir: path.resolve(__dirname, "../../../backend/contracts/pacts"),
});

const EVENT_ID = "11111111-1111-1111-1111-111111111111";

async function run() {
  // POST /api/events
  provider
    .given("an organizer wants to create an event")
    .uponReceiving("a request to create an event")
    .withRequest({
      method: "POST",
      path: "/api/events",
      headers: { "Content-Type": "application/json" },
      body: {
        title: "Team Offsite",
        description: "Planning day",
        location: "Makati",
        starts_at: "2026-11-15T09:00:00.000Z",
      },
    })
    .willRespondWith({
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: {
        event: {
          id: uuid(EVENT_ID),
          title: string("Team Offsite"),
          description: like("Planning day"),
          location: like("Makati"),
          starts_at: string("2026-11-15T09:00:00.000Z"),
          created_at: string("2026-09-01T00:00:00.000Z"),
        },
      },
    });

  await provider.executeTest(async (mockServer) => {
    process.env.NEXT_PUBLIC_API_BASE_URL = mockServer.url;
    const { createEvent } = await import("../lib/api-client");

    const { event } = await createEvent({
      title: "Team Offsite",
      description: "Planning day",
      location: "Makati",
      starts_at: "2026-11-15T09:00:00.000Z",
    });

    if (event.title !== "Team Offsite") {
      throw new Error("createEvent did not return the expected event shape");
    }
  });

  // POST /api/events/:id/rsvps
  provider
    .given("an event exists", { eventId: EVENT_ID })
    .uponReceiving("a request to submit an RSVP")
    .withRequest({
      method: "POST",
      path: `/api/events/${EVENT_ID}/rsvps`,
      headers: { "Content-Type": "application/json" },
      body: {
        name: "Maria Santos",
        email: "maria@example.com",
        status: "yes",
        guest_count: 1,
      },
    })
    .willRespondWith({
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: {
        rsvp: {
          id: uuid(),
          event_id: uuid(EVENT_ID),
          name: string("Maria Santos"),
          email: string("maria@example.com"),
          status: string("yes"),
          guest_count: like(1),
          created_at: string("2026-09-05T00:00:00.000Z"),
        },
      },
    });

  await provider.executeTest(async (mockServer) => {
    process.env.NEXT_PUBLIC_API_BASE_URL = mockServer.url;
    const { submitRsvp } = await import("../lib/api-client");

    const { rsvp } = await submitRsvp(EVENT_ID, {
      name: "Maria Santos",
      email: "maria@example.com",
      status: "yes",
      guest_count: 1,
    });

    if (rsvp.status !== "yes") {
      throw new Error("submitRsvp did not return the expected rsvp shape");
    }
  });

  console.log("Consumer contract test passed. Pact file written to backend/contracts/pacts.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
