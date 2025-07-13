import type { Meta, StoryObj } from "@storybook/react-vite";
import Window from "@/components/window";
import WindowContext from "@/components/window-context";
import useWindow from "@/hooks/use-window";
import { expect, within } from "@storybook/test";
import { wait } from "../utils/wait";
import { openWindow } from "../utils/window-utils";
import { useEffect } from "react";
import type {
  SetWindowStateType,
  GetWindowStateType,
} from "../utils/use-window-utils";

const meta: Meta<typeof Window> = {
  title: "Components/Window/Test",
  component: Window,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ウィンドウのz-indexを取得する
const getWindowZIndex = (canvasElement: HTMLElement, title: string) => {
  const canvas = within(canvasElement);
  const headerElement = canvas.getByText(title);
  // 親を辿り、styleにz-indexが設定されている要素を探す
  let currentElement = headerElement.parentElement;
  while (currentElement) {
    if (currentElement.style.zIndex) {
      return Number(currentElement.style.zIndex);
    }
    currentElement = currentElement.parentElement;
  }
  return null;
};

const defaultWindowState = {
  open: false,
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0 },
};
const defaultGetWindowState = () => ({
  ...defaultWindowState,
});

const WindowMovesToFrontWhenSetWindowStateCalledDatas = {
  getWindowState: defaultGetWindowState as GetWindowStateType,
  setWindowState: (() => null) as SetWindowStateType,
};

export const WindowMovesToFrontWhenSetWindowStateCalled: Story = {
  render: () => {
    const datas = WindowMovesToFrontWhenSetWindowStateCalledDatas;
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();

    // 3つのウィンドウを開く
    useEffect(() => {
      openWindow(setWindowState, "window1", 100, 100, 200, 200);
      openWindow(setWindowState, "window2", 150, 150, 200, 200);
      openWindow(setWindowState, "window3", 200, 200, 200, 200);
    }, [setWindowState]);

    datas.getWindowState = (key: string) => getWindowState(key);
    datas.setWindowState = setWindowState;

    return (
      <WindowContext dispatcher={stateDispatcher}>
        <Window windowKey="window1" title="window1" />
        <Window windowKey="window2" title="window2" />
        <Window windowKey="window3" title="window3" />
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 3つのウィンドウを開く。1つ目のウィンドウのキーでsetWindowStateする。
    // 1つ目のウィンドウが最前面に移動する。
    // Arrange
    const datas = WindowMovesToFrontWhenSetWindowStateCalledDatas;

    // Act - 1つ目のウィンドウを再度開く
    datas.setWindowState("window1", { open: true });
    await wait();

    // Assert - 1つ目のウィンドウがフォーカスされる(z-indexが最も大きい)
    console.info("expect");
    const zIndex1 = getWindowZIndex(canvasElement, "window1");
    const zIndex2 = getWindowZIndex(canvasElement, "window2");
    const zIndex3 = getWindowZIndex(canvasElement, "window3");
    expect(zIndex1).not.toBeNull();
    expect(zIndex2).not.toBeNull();
    expect(zIndex3).not.toBeNull();
    expect(zIndex1).toBeGreaterThan(zIndex2 ?? 0);
    expect(zIndex1).toBeGreaterThan(zIndex3 ?? 0);
  },
};

const FocusTransfersToPreviousWindowWhenFrontWindowClosesDatas = {
  getWindowState: defaultGetWindowState as GetWindowStateType,
  setWindowState: (() => null) as SetWindowStateType,
};

export const FocusTransfersToPreviousWindowWhenFrontWindowCloses: Story = {
  render: () => {
    const datas = FocusTransfersToPreviousWindowWhenFrontWindowClosesDatas;
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();

    // 3つのウィンドウを開く
    useEffect(() => {
      openWindow(setWindowState, "window1", 100, 100, 200, 200);
      openWindow(setWindowState, "window2", 150, 150, 200, 200);
      openWindow(setWindowState, "window3", 200, 200, 200, 200);
    }, [setWindowState]);

    datas.getWindowState = (key: string) => getWindowState(key);
    datas.setWindowState = setWindowState;

    return (
      <WindowContext dispatcher={stateDispatcher}>
        <Window windowKey="window1" title="window1" />
        <Window windowKey="window2" title="window2" />
        <Window windowKey="window3" title="window3" />
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 3つのウィンドウを開き、setWindowStateで最前面のウィンドウを閉じる。
    // 2個目に開いたウィンドウのヘッダに最前面アイコンが表示され、フォーカスされる。
    // Arrange
    const datas = FocusTransfersToPreviousWindowWhenFrontWindowClosesDatas;

    // Act - 最前面のウィンドウを閉じる
    datas.setWindowState("window3", { open: false });
    await wait();

    // Assert - 2つ目のウィンドウがフォーカスされる(z-indexが最も大きい)
    const zIndex1 = getWindowZIndex(canvasElement, "window1");
    const zIndex2 = getWindowZIndex(canvasElement, "window2");
    expect(zIndex1).not.toBeNull();
    expect(zIndex2).not.toBeNull();
    expect(zIndex2).toBeGreaterThan(zIndex1 ?? 0);
  },
};

const FocusRemainsOnFrontWindowWhenNonFrontWindowClosesDatas = {
  getWindowState: defaultGetWindowState as GetWindowStateType,
  setWindowState: (() => null) as SetWindowStateType,
};

export const FocusRemainsOnFrontWindowWhenNonFrontWindowCloses: Story = {
  render: () => {
    const datas = FocusRemainsOnFrontWindowWhenNonFrontWindowClosesDatas;
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();

    // 3つのウィンドウを開く
    useEffect(() => {
      openWindow(setWindowState, "window1", 100, 100, 200, 200);
      openWindow(setWindowState, "window2", 150, 150, 200, 200);
      openWindow(setWindowState, "window3", 200, 200, 200, 200);
    }, [setWindowState]);

    datas.getWindowState = (key: string) => getWindowState(key);

    return (
      <WindowContext dispatcher={stateDispatcher}>
        <Window windowKey="window1" title="window1" />
        <Window windowKey="window2" title="window2" />
        <Window windowKey="window3" title="window3" />
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 3つのウィンドウを開き、setWindowStateで2個目に開いたウィンドウを閉じる。
    // 3個目に開いたウィンドウのヘッダに最前面アイコンが表示され続け、フォーカスが移動しない。
    // Arrange
    const datas = FocusRemainsOnFrontWindowWhenNonFrontWindowClosesDatas;

    // Act - 2つ目のウィンドウを閉じる
    datas.setWindowState("window2", { open: false });
    await wait();

    // Assert - 3つ目のウィンドウがフォーカスされ続ける
    const zIndex1 = getWindowZIndex(canvasElement, "window1");
    const zIndex2 = getWindowZIndex(canvasElement, "window2");
    const zIndex3 = getWindowZIndex(canvasElement, "window3");
    expect(zIndex1).not.toBeNull();
    expect(zIndex2).not.toBeNull();
    expect(zIndex3).not.toBeNull();
    expect(zIndex3).toBeGreaterThan(zIndex1 ?? 0);
    expect(zIndex3).toBeGreaterThan(zIndex2 ?? 0);
  },
};
