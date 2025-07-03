import { ContextMenu, ContextMenuItem } from "@/components/context-menu";
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
    const user = await userEvent.setup();
    const canvas = within(canvasElement);
    const datas = ContextMenuItemInvokeHandlerWhenClickedDatas;
    datas.test1Spy.mockClear();
    datas.test2Spy.mockClear();
    datas.test3Spy.mockClear();
    const test2 = canvas.getByText("test2");

    await user.click(test2);

    await expect(datas.test2Spy).toHaveBeenCalledTimes(1);
    await expect(datas.test1Spy).not.toHaveBeenCalled();
    await expect(datas.test3Spy).not.toHaveBeenCalled();
  },
};
