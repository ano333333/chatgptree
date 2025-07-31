import {
  ContextMenu,
  ContextMenuContext,
  ContextMenuItem,
  ContextMenuSubMenu,
  ContextMenuSubMenuRoot,
  ContextMenuSubMenuTrigger,
  type ContextMenuElement,
} from "@/components/context-menu";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent } from "@storybook/test";
import { within, expect } from "@storybook/test";
import { useRef } from "react";
import { wait } from "../utils/wait";

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
      <ContextMenuContext>
        <ContextMenu initialPosition={{ x: 0, y: 0 }}>
          <ContextMenuItem onClick={datas.test1Spy}>test1</ContextMenuItem>
          <ContextMenuItem onClick={datas.test2Spy}>test2</ContextMenuItem>
          <ContextMenuItem onClick={datas.test3Spy}>test3</ContextMenuItem>
        </ContextMenu>
      </ContextMenuContext>
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
    await expect(datas.test1Spy).not.toHaveBeenCalled();
    await expect(datas.test3Spy).not.toHaveBeenCalled();
  },
};

export const ContextMenuSubMenuTriggerItemContainsChevronRightDatas: Story = {
  render: () => {
    return (
      <ContextMenuContext>
        <ContextMenu initialPosition={{ x: 0, y: 0 }}>
          <ContextMenuSubMenuRoot>
            <ContextMenuSubMenuTrigger>submenu</ContextMenuSubMenuTrigger>
            <ContextMenuSubMenu>
              <ContextMenuItem>submenu item 1</ContextMenuItem>
              <ContextMenuItem>submenu item 2</ContextMenuItem>
            </ContextMenuSubMenu>
          </ContextMenuSubMenuRoot>
        </ContextMenu>
      </ContextMenuContext>
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
        <ContextMenuContext>
          <ContextMenu initialPosition={{ x: 0, y: 0 }}>
            <ContextMenuSubMenuRoot>
              <ContextMenuSubMenuTrigger>submenu</ContextMenuSubMenuTrigger>
              <ContextMenuSubMenu>
                <ContextMenuItem>submenu item 1</ContextMenuItem>
                <ContextMenuItem>submenu item 2</ContextMenuItem>
              </ContextMenuSubMenu>
            </ContextMenuSubMenuRoot>
          </ContextMenu>
        </ContextMenuContext>
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
      <ContextMenuContext>
        <ContextMenu initialPosition={{ x: 0, y: 0 }}>
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
      </ContextMenuContext>
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

const ContextMenuClosesWhenAnotherOpensDatas = {
  getNewContextMenuElement: (() => null) as () => ContextMenuElement | null,
};

export const ContextMenuClosesWhenAnotherOpens: Story = {
  render: () => {
    const datas = ContextMenuClosesWhenAnotherOpensDatas;
    const newContextMenuElementRef = useRef<ContextMenuElement>(null);
    datas.getNewContextMenuElement = () => newContextMenuElementRef.current;
    return (
      <ContextMenuContext>
        <ContextMenu initialPosition={{ x: 0, y: 0 }}>
          <ContextMenuItem>contextMenuOld</ContextMenuItem>
        </ContextMenu>
        <ContextMenu ref={newContextMenuElementRef}>
          <ContextMenuItem>contextMenuNew</ContextMenuItem>
        </ContextMenu>
      </ContextMenuContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 新しいContextMenuが開くと既に開いていたContextMenuが閉じる
    // Arrange
    const canvas = within(canvasElement);
    const datas = ContextMenuClosesWhenAnotherOpensDatas;

    // Act
    datas.getNewContextMenuElement()?.setContextMenuState({
      status: "open",
      position: { x: 0, y: 0 },
    });
    await wait();

    // Assert
    const newContextMenuItem = canvas.getByText("contextMenuNew");
    await expect(newContextMenuItem).toBeInTheDocument();
    const oldContextMenuItem = canvas.queryByText("contextMenuOld");
    await expect(oldContextMenuItem).toBeNull();
  },
};

export const ContextMenuClosesWhenOutsideClicked: Story = {
  render: () => {
    return (
      <>
        <div className="w-full h-full bg-red-500" id="container" />
        <ContextMenuContext>
          <ContextMenu initialPosition={{ x: 0, y: 0 }}>
            <ContextMenuItem>contextMenu</ContextMenuItem>
          </ContextMenu>
        </ContextMenuContext>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    // コンテキストメニューの外側がクリックされるとコンテキストメニューが閉じる
    // Arrange
    const canvas = within(canvasElement);

    // Act
    const container = document.getElementById("container");
    if (!container) {
      throw new Error("container element not found");
    }
    // (200, 200)の座標をクリックするイベントを発火させる
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 200,
      clientY: 200,
    });
    container.dispatchEvent(clickEvent);
    await wait();

    // Assert
    const contextMenu = canvas.queryByText("contextMenu");
    await expect(contextMenu).toBeNull();
  },
};

const ContextMenuOpensWithElementRefDatas = {
  getContextMenuElement: (() => null) as () => ContextMenuElement | null,
};

const ContextMenuItemClickDoesNotTriggerBackgroundElementClickHandlerDatas = {
  backgroundElementSpy: fn(),
};

export const ContextMenuItemClickDoesNotTriggerBackgroundElementClickHandler: Story =
  {
    render: () => {
      const datas =
        ContextMenuItemClickDoesNotTriggerBackgroundElementClickHandlerDatas;
      return (
        <>
          <div
            className="w-full h-full bg-red-500"
            onClick={datas.backgroundElementSpy}
            onKeyDown={datas.backgroundElementSpy}
            id="background-element"
          />
          <ContextMenuContext>
            <ContextMenu initialPosition={{ x: 0, y: 0 }}>
              <ContextMenuItem>contextMenu</ContextMenuItem>
            </ContextMenu>
          </ContextMenuContext>
        </>
      );
    },
    play: async ({ canvasElement }) => {
      // ContextMenuItemをクリックしても、その背後の要素(全面に張ったdiv要素)のonClickが呼ばれない
      // Arrange
      const user = await userEvent.setup();
      const canvas = within(canvasElement);
      const datas =
        ContextMenuItemClickDoesNotTriggerBackgroundElementClickHandlerDatas;
      datas.backgroundElementSpy.mockClear();

      // Act
      const contextMenuItem = canvas.getByText("contextMenu");
      await user.click(contextMenuItem);

      // Assert
      await expect(datas.backgroundElementSpy).not.toHaveBeenCalled();
    },
  };

export const ContextMenuOpensWithElementRef: Story = {
  render: () => {
    const datas = ContextMenuOpensWithElementRefDatas;
    const contextMenuElementRef = useRef<ContextMenuElement>(null);
    datas.getContextMenuElement = () => contextMenuElementRef.current;
    return (
      <ContextMenuContext>
        <ContextMenu
          initialPosition={{ x: 0, y: 0 }}
          ref={contextMenuElementRef}
        >
          <ContextMenuItem>contextMenu</ContextMenuItem>
        </ContextMenu>
      </ContextMenuContext>
    );
  },
  play: async ({ canvasElement }) => {
    // コンテキストメニューのrefのsetContextMenuStateが呼ばれるとコンテキストメニューが開く
    // Arrange
    const canvas = within(canvasElement);
    const datas = ContextMenuOpensWithElementRefDatas;
    const element = datas.getContextMenuElement();
    if (!element) {
      throw new Error("contextMenu element not found");
    }

    // Act
    element.setContextMenuState({
      status: "open",
      position: { x: 100, y: 100 },
    });
    await wait();

    // Assert
    const contextMenu = canvas.getByText("contextMenu");
    await expect(contextMenu).toBeInTheDocument();
    const position = {
      x: Number.parseFloat(element.style?.left ?? "NaN"),
      y: Number.parseFloat(element.style?.top ?? "NaN"),
    };
    await expect(position.x).toBeCloseTo(100, 1);
    await expect(position.y).toBeCloseTo(100, 1);
  },
};

const ContextMenuClosesWithElementRefDatas = {
  getContextMenuElement: (() => null) as () => ContextMenuElement | null,
};

export const ContextMenuClosesWithElementRef: Story = {
  render: () => {
    const datas = ContextMenuClosesWithElementRefDatas;
    const contextMenuElementRef = useRef<ContextMenuElement>(null);
    datas.getContextMenuElement = () => contextMenuElementRef.current;
    return (
      <ContextMenuContext>
        <ContextMenu
          initialPosition={{ x: 0, y: 0 }}
          ref={contextMenuElementRef}
        >
          <ContextMenuItem>contextMenu</ContextMenuItem>
        </ContextMenu>
      </ContextMenuContext>
    );
  },
  play: async ({ canvasElement }) => {
    // コンテキストメニューのrefのsetContextMenuStateが呼ばれるとコンテキストメニューが閉じる
    // Arrange
    const canvas = within(canvasElement);
    const datas = ContextMenuClosesWithElementRefDatas;

    // Act
    datas.getContextMenuElement()?.setContextMenuState({
      status: "close",
    });
    await wait();

    // Assert
    const contextMenu = canvas.queryByText("contextMenu");
    await expect(contextMenu).toBeNull();
  },
};
