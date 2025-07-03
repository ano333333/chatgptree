import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/context-menu";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ContextMenuStory: Story = {
  render: () => (
    <ContextMenu screenPosition={{ x: 0, y: 0 }}>
      <ContextMenuItem key="test1" onClick={action("test1")}>
        test1
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem key="test2" onClick={action("test2")}>
        test2
      </ContextMenuItem>
    </ContextMenu>
  ),
};
