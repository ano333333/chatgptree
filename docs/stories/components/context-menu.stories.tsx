import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { action } from "storybook/actions";
import {
  ContextMenu,
  ContextMenuContext,
  type ContextMenuElement,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSubMenu,
  ContextMenuSubMenuRoot,
  ContextMenuSubMenuTrigger,
} from "@/components/context-menu";

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
  render: () => {
    const contextMenuRef = useRef<ContextMenuElement>(null);
    return (
      <>
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              contextMenuRef.current?.setContextMenuState({
                status: "open",
                position: { x: 0, y: 0 },
              });
            }}
          >
            open
          </button>
        </div>
        <div
          className="absolute top-[200px] left-[200px] w-[200px] h-[200px] bg-red-500"
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            contextMenuRef.current?.setContextMenuState({
              status: "open",
              position: { x: e.clientX, y: e.clientY },
            });
          }}
        >
          右クリックでコンテキストメニューを開く
        </div>
        <ContextMenuContext>
          <ContextMenu initialPosition={{ x: 0, y: 0 }} ref={contextMenuRef}>
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
              <ContextMenuSubMenuTrigger>
                2level-submenu
              </ContextMenuSubMenuTrigger>
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
        </ContextMenuContext>
      </>
    );
  },
};
