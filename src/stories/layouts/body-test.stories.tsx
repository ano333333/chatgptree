import type { Meta, StoryObj } from "@storybook/react-vite";
import Body from "@/layouts/body";
import { expect, fn, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Body> = {
  title: "Layouts/Body/Test",
  component: Body,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const BodyContextMenuItemsInvokeHandlersDatas = {
  containerOnclickSpy: fn(),
  createUserPromptHandlerSpy: fn(),
};

export const BodyContextMenuItemsInvokeHandlers: Story = {
  render: () => {
    const datas = BodyContextMenuItemsInvokeHandlersDatas;
    return (
      <div
        onClick={datas.containerOnclickSpy}
        onKeyDown={datas.containerOnclickSpy}
      >
        <Body
          initialContextMenuState={{
            status: "open",
            position: { x: 100, y: 100 },
          }}
          onClickCreateUserPrompt={datas.createUserPromptHandlerSpy}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ボディコンテキストメニューの各ボタンをクリックすると、ハンドラーが呼ばれメニューが閉じる。
    // 後ろの要素のハンドラーは呼び出されない。
    // Arrange
    const user = await userEvent.setup();
    const canvas = within(canvasElement);
    const datas = BodyContextMenuItemsInvokeHandlersDatas;
    datas.containerOnclickSpy.mockClear();

    // Act
    const createButton = canvas.queryByText("作成");
    if (!createButton) {
      throw new Error("作成ボタンが見つかりません");
    }
    await user.hover(createButton);
    const createUserPromptButton = canvas.getByText("ユーザープロンプト");
    await user.click(createUserPromptButton);

    // Assert
    await expect(datas.createUserPromptHandlerSpy).toHaveBeenCalled();
    await expect(datas.containerOnclickSpy).not.toHaveBeenCalled();
    await expect(canvas.getByText("作成")).not.toBeInTheDocument();
  },
};
