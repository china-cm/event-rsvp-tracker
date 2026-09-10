import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RsvpList } from "./RsvpList";

const meta: Meta<typeof RsvpList> = {
  title: "Components/RsvpList",
  component: RsvpList,
};

export default meta;
type Story = StoryObj<typeof RsvpList>;

export const Empty: Story = {
  args: { rsvps: [] },
};

export const WithRsvps: Story = {
  args: {
    rsvps: [
      {
        id: "a1",
        event_id: "11111111-1111-1111-1111-111111111111",
        name: "Maria Santos",
        email: "maria@example.com",
        status: "yes",
        guest_count: 1,
        created_at: "2026-09-05T00:00:00.000Z",
      },
      {
        id: "a2",
        event_id: "11111111-1111-1111-1111-111111111111",
        name: "Jon Reyes",
        email: "jon@example.com",
        status: "maybe",
        guest_count: 0,
        created_at: "2026-09-06T00:00:00.000Z",
      },
      {
        id: "a3",
        event_id: "11111111-1111-1111-1111-111111111111",
        name: "Ana Cruz",
        email: "ana@example.com",
        status: "no",
        guest_count: 0,
        created_at: "2026-09-07T00:00:00.000Z",
      },
    ],
  },
};
