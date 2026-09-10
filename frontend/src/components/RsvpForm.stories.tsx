import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RsvpForm } from "./RsvpForm";

const meta: Meta<typeof RsvpForm> = {
  title: "Components/RsvpForm",
  component: RsvpForm,
};

export default meta;
type Story = StoryObj<typeof RsvpForm>;

export const Default: Story = {
  args: {
    eventId: "11111111-1111-1111-1111-111111111111",
    onSubmit: async () => {
      // no-op for Storybook/Chromatic snapshots
    },
  },
};
