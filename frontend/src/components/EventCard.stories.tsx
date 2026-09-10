import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventCard } from "./EventCard";

const meta: Meta<typeof EventCard> = {
  title: "Components/EventCard",
  component: EventCard,
};

export default meta;
type Story = StoryObj<typeof EventCard>;

export const Default: Story = {
  args: {
    event: {
      id: "11111111-1111-1111-1111-111111111111",
      title: "Team Offsite 2026",
      description: "A day of workshops, planning, and team building.",
      location: "Makati, Philippines",
      starts_at: "2026-11-15T09:00:00.000Z",
      created_at: "2026-09-01T00:00:00.000Z",
    },
  },
};

export const NoDescription: Story = {
  args: {
    event: {
      id: "22222222-2222-2222-2222-222222222222",
      title: "Quarterly All-Hands",
      description: null,
      location: null,
      starts_at: "2026-12-01T15:00:00.000Z",
      created_at: "2026-09-01T00:00:00.000Z",
    },
  },
};
