import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSubMenu,
  ContextMenuSubMenuRoot,
  ContextMenuSubMenuTrigger,
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
      <ContextMenuItem key="test2" onClick={action("test2")}>
        test2
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuSubMenuRoot>
        <ContextMenuSubMenuTrigger>submenu</ContextMenuSubMenuTrigger>
        <ContextMenuSubMenu>
          <ContextMenuItem>submenu item 1</ContextMenuItem>
          <ContextMenuItem>submenu item 2</ContextMenuItem>
        </ContextMenuSubMenu>
      </ContextMenuSubMenuRoot>
      <ContextMenuSeparator />
      <ContextMenuSubMenuRoot>
        <ContextMenuSubMenuTrigger>2level-submenu</ContextMenuSubMenuTrigger>
        <ContextMenuSubMenu>
          <ContextMenuItem>2level-submenu item 1</ContextMenuItem>
          <ContextMenuSubMenuRoot>
            <ContextMenuSubMenuTrigger>
              2level-submenu trigger
            </ContextMenuSubMenuTrigger>
            <ContextMenuSubMenu>
              <ContextMenuItem>2level-submenu item 2</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>2level-submenu item 3</ContextMenuItem>
            </ContextMenuSubMenu>
          </ContextMenuSubMenuRoot>
        </ContextMenuSubMenu>
      </ContextMenuSubMenuRoot>
    </ContextMenu>
  ),
};
