import Body from "@/layouts/body";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

const meta: Meta<typeof Body> = {
  title: "Layouts/Body",
  component: Body,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Body
        initialContextMenuState={{
          status: "open",
          position: { x: 100, y: 100 },
        }}
        onClickCreateUserPrompt={action("onClickCreateUserPrompt")}
        onClickCreateSystemPrompt={action("onClickCreateSystemPrompt")}
        onClickUndo={action("onClickUndo")}
        onClickRedo={action("onClickRedo")}
        onClickPaste={action("onClickPaste")}
      />
    );
  },
};
