import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSubMenu,
  ContextMenuSubMenuRoot,
  ContextMenuSubMenuTrigger,
} from "@/components/context-menu";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent } from "@storybook/test";
import { within, expect } from "@storybook/test";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu/Test",
  component: ContextMenu,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ContextMenuItemInvokeHandlerWhenClickedDatas = {
  test1Spy: fn(),
  test2Spy: fn(),
  test3Spy: fn(),
};

export const ContextMenuItemInvokeHandlerWhenClicked: Story = {
  render: () => {
    const datas = ContextMenuItemInvokeHandlerWhenClickedDatas;
    return (
      <ContextMenu screenPosition={{ x: 0, y: 0 }}>
        <ContextMenuItem onClick={datas.test1Spy}>test1</ContextMenuItem>
        <ContextMenuItem onClick={datas.test2Spy}>test2</ContextMenuItem>
        <ContextMenuItem onClick={datas.test3Spy}>test3</ContextMenuItem>
      </ContextMenu>
    );
  },
  play: async ({ canvasElement }) => {
    // ContextMenuItemがクリックされるとハンドラが呼ばれる
    // Arrange
    const user = await userEvent.setup();
    const canvas = within(canvasElement);
    const datas = ContextMenuItemInvokeHandlerWhenClickedDatas;
    datas.test1Spy.mockClear();
    datas.test2Spy.mockClear();
    datas.test3Spy.mockClear();

    // Act
    const test2 = canvas.getByText("test2");
    await user.click(test2);

    // Assert
    await expect(datas.test2Spy).toHaveBeenCalledTimes(1);
    // await expect(datas.test1Spy).not.toHaveBeenCalled();
    await expect(datas.test1Spy).toHaveBeenCalledTimes(1);
    await expect(datas.test3Spy).not.toHaveBeenCalled();
  },
};

export const ContextMenuSubMenuTriggerItemContainsChevronRightDatas: Story = {
  render: () => {
    return (
      <ContextMenu screenPosition={{ x: 0, y: 0 }}>
        <ContextMenuSubMenuRoot>
          <ContextMenuSubMenuTrigger>submenu</ContextMenuSubMenuTrigger>
          <ContextMenuSubMenu>
            <ContextMenuItem>submenu item 1</ContextMenuItem>
            <ContextMenuItem>submenu item 2</ContextMenuItem>
          </ContextMenuSubMenu>
        </ContextMenuSubMenuRoot>
      </ContextMenu>
    );
  },
  play: async ({ canvasElement }) => {
    // ContextMenuSubMenuTriggerItemにはChevronRightが含まれる(svg要素としてテスト)
    // Arrange
    const canvas = within(canvasElement);
    const submenuTrigger = canvas.getByText("submenu");
    const chevronRight = submenuTrigger.querySelector("svg");

    // Assert
    await expect(chevronRight).toBeInTheDocument();
  },
};

export const ContextMenuSubMenuOpensOnlyWhenSubMenuTriggerAndSubMenuItemHovered: Story =
  {
    render: () => {
      return (
        <ContextMenu screenPosition={{ x: 0, y: 0 }}>
          <ContextMenuSubMenuRoot>
            <ContextMenuSubMenuTrigger>submenu</ContextMenuSubMenuTrigger>
            <ContextMenuSubMenu>
              <ContextMenuItem>submenu item 1</ContextMenuItem>
              <ContextMenuItem>submenu item 2</ContextMenuItem>
            </ContextMenuSubMenu>
          </ContextMenuSubMenuRoot>
        </ContextMenu>
      );
    },
    play: async ({ canvasElement }) => {
      // ContextMenuSubMenuTriggerがホバーされるとContextMenuSubMenuが開く
      // Arrange
      const user = await userEvent.setup();
      const canvas = within(canvasElement);

      // Act
      const subMenuTrigger = canvas.getByText("submenu");
      await user.hover(subMenuTrigger);

      // Assert
      const subMenuItem1 = canvas.getByText("submenu item 1");
      const subMenuItem2 = canvas.getByText("submenu item 2");
      await expect(subMenuItem1).toBeInTheDocument();
      await expect(subMenuItem2).toBeInTheDocument();

      // 続けてContextMenuSubMenuItemがホバーされてもContextMenuSubMenuが開いたままになる
      // Act
      await user.hover(subMenuItem1);

      // Assert
      await expect(subMenuItem1).toBeInTheDocument();
      await expect(subMenuItem2).toBeInTheDocument();

      // ホバーを外すとContextMenuSubMenuが閉じる

      // Act
      await user.unhover(subMenuItem1);

      // Assert
      await expect(subMenuItem1).not.toBeInTheDocument();
      await expect(subMenuItem2).not.toBeInTheDocument();
    },
  };

const ContextMenuSubMenuItemInvokeHandlerWhenClickedDatas = {
  subMenuItem1Spy: fn(),
  subMenuItem2Spy: fn(),
};

export const ContextMenuSubMenuItemInvokeHandlerWhenClicked: Story = {
  render: () => {
    const datas = ContextMenuSubMenuItemInvokeHandlerWhenClickedDatas;
    return (
      <ContextMenu screenPosition={{ x: 0, y: 0 }}>
        <ContextMenuSubMenuRoot>
          <ContextMenuSubMenuTrigger>submenu</ContextMenuSubMenuTrigger>
          <ContextMenuSubMenu>
            <ContextMenuItem onClick={datas.subMenuItem1Spy}>
              submenu item 1
            </ContextMenuItem>
            <ContextMenuItem onClick={datas.subMenuItem2Spy}>
              submenu item 2
            </ContextMenuItem>
          </ContextMenuSubMenu>
        </ContextMenuSubMenuRoot>
      </ContextMenu>
    );
  },
  play: async ({ canvasElement }) => {
    // ContextMenuSubMenuItemがクリックされるとContextMenuSubMenuTriggerのハンドラが呼ばれる
    // Arrange
    const user = await userEvent.setup();
    const canvas = within(canvasElement);
    const datas = ContextMenuSubMenuItemInvokeHandlerWhenClickedDatas;
    datas.subMenuItem1Spy.mockClear();
    datas.subMenuItem2Spy.mockClear();
    const subMenuTrigger = canvas.getByText("submenu");
    await user.hover(subMenuTrigger);

    // Act
    const subMenuItem1 = canvas.getByText("submenu item 1");
    await user.click(subMenuItem1);

    // Assert
    await expect(datas.subMenuItem1Spy).toHaveBeenCalledTimes(1);
    await expect(datas.subMenuItem2Spy).not.toHaveBeenCalled();
  },
};
