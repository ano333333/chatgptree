import type { Meta, StoryObj } from "@storybook/react-vite";
import { Window, WindowContext } from "@/components/window";
import useWindow from "@/hooks/use-window";
import { expect } from "@storybook/test";
import { wait } from "../utils/wait";
import { openWindow } from "../utils/window-utils";
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

const defaultWindowState = {
  open: false,
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0 },
};
const defaultGetWindowState = () => ({
  ...defaultWindowState,
});

const WindowUsesDefaultPositionAndSizeDatas = {
  getWindowState: defaultGetWindowState as GetWindowStateType,
  setWindowState: (() => null) as SetWindowStateType,
};

export const WindowUsesDefaultPositionAndSize: Story = {
  render: () => {
    const datas = WindowUsesDefaultPositionAndSizeDatas;
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();
    datas.getWindowState = (key: string) => getWindowState(key);
    datas.setWindowState = setWindowState;

    return (
      <WindowContext
        dispatcher={stateDispatcher}
        default-window-position={{ x: 150, y: 150 }}
        default-window-size={{ width: 300, height: 300 }}
      >
        <Window key="window1" title="title" />
      </WindowContext>
    );
  },
  play: async () => {
    // positionとstyleを指定せずにsetWindowStateでウィンドウを開き、getWindowStateする。
    // 返り値とWindowsRootのデフォルト値が一致する。
    // Arrange
    const datas = WindowUsesDefaultPositionAndSizeDatas;

    // Act
    datas.setWindowState("window1", { open: true });
    await wait();

    // Assert
    const state = datas.getWindowState("window1");
    expect(state).not.toBeNull();
    if (state?.open) {
      expect(state.position.x).toBe(150);
      expect(state.position.y).toBe(150);
      expect(state.size.width).toBe(300);
      expect(state.size.height).toBe(300);
    }
  },
};

const WindowUsesCustomPositionAndSizeDatas = {
  getWindowState: defaultGetWindowState as GetWindowStateType,
  setWindowState: (() => null) as SetWindowStateType,
};

export const WindowUsesCustomPositionAndSize: Story = {
  render: () => {
    const datas = WindowUsesCustomPositionAndSizeDatas;
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();
    datas.getWindowState = (key: string) => getWindowState(key);
    datas.setWindowState = setWindowState;

    return (
      <WindowContext dispatcher={stateDispatcher}>
        <Window key="window1" title="title" />
      </WindowContext>
    );
  },
  play: async () => {
    // positionとsizeを指定してsetWindowStateでウィンドウを開き、getWindowStateする。
    // 指定した位置・サイズとgetWindowStateの返り値が一致する。
    // Arrange
    const datas = WindowUsesCustomPositionAndSizeDatas;

    // Act
    openWindow(datas.setWindowState, "window1", 200, 200, 400, 400);
    await wait();

    // Assert
    const state = datas.getWindowState("window1");
    expect(state).not.toBeNull();
    if (state?.open) {
      expect(state.position.x).toBe(200);
      expect(state.position.y).toBe(200);
      expect(state.size.width).toBe(400);
      expect(state.size.height).toBe(400);
    }
  },
};

const WindowRemembersPreviousPositionAndSizeDatas = {
  getWindowState: defaultGetWindowState as GetWindowStateType,
  setWindowState: (() => null) as SetWindowStateType,
};

export const WindowRemembersPreviousPositionAndSize: Story = {
  render: () => {
    const datas = WindowRemembersPreviousPositionAndSizeDatas;
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();
    datas.getWindowState = (key: string) => getWindowState(key);
    datas.setWindowState = setWindowState;

    return (
      <WindowContext
        dispatcher={stateDispatcher}
        default-window-position={{ x: 150, y: 150 }}
        default-window-size={{ width: 300, height: 300 }}
      >
        <Window key="window1" title="title" />
      </WindowContext>
    );
  },
  play: async () => {
    // positionとstyleを指定してsetWindowStateでウィンドウを開き、閉じる。
    // 再度同じキーでsetWindowStateしウィンドウを開き、getWindowStateする。
    // 最初に指定した位置・サイズとgetWindowStateの返り値が一致する。
    // Arrange
    const datas = WindowRemembersPreviousPositionAndSizeDatas;
    const customPosition = { x: 200, y: 200 };
    const customSize = { width: 400, height: 400 };

    // Act - カスタム位置・サイズで開く
    openWindow(
      datas.setWindowState,
      "window1",
      customPosition.x,
      customPosition.y,
      customSize.width,
      customSize.height,
    );
    await wait();

    // Act - 閉じる
    datas.setWindowState("window1", { open: false });
    await wait();

    // Act - 再度開く（位置・サイズ指定なし）
    datas.setWindowState("window1", { open: true });
    await wait();

    // Assert - 前回の位置・サイズが記憶されている
    const state = datas.getWindowState("window1");
    expect(state).not.toBeNull();
    if (state?.open) {
      expect(state.position.x).toBe(customPosition.x);
      expect(state.position.y).toBe(customPosition.y);
      expect(state.size.width).toBe(customSize.width);
      expect(state.size.height).toBe(customSize.height);
    }
  },
};

const WindowClosesWhenZIndexLimitExceededDatas = {
  getWindowState: defaultGetWindowState as GetWindowStateType,
  setWindowState: (() => null) as SetWindowStateType,
  isWindowOpen: (() => false) as (key: string) => boolean,
};

export const WindowClosesWhenZIndexLimitExceeded: Story = {
  render: () => {
    const datas = WindowClosesWhenZIndexLimitExceededDatas;
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();
    datas.getWindowState = (key: string) => getWindowState(key);
    datas.setWindowState = setWindowState;
    datas.isWindowOpen = (key: string) => {
      const state = getWindowState(key);
      return state?.open || false;
    };

    return (
      <WindowContext
        dispatcher={stateDispatcher}
        z-index-min={1}
        z-index-max={3}
      >
        <Window key="window1" title="Window 1" />
        <Window key="window2" title="Window 2" />
        <Window key="window3" title="Window 3" />
        <Window key="window4" title="Window 4" />
      </WindowContext>
    );
  },
  play: async () => {
    // WindowContextのz-index-minに1を、z-index-maxに3を指定する。
    // 3つのウィンドウを開いている状態でさらにもう1つウィンドウを開くと、1つ目のウィンドウが閉じる。
    // Arrange
    const datas = WindowClosesWhenZIndexLimitExceededDatas;

    // Act - 3つのウィンドウを開く
    openWindow(datas.setWindowState, "window1", 100, 100, 200, 200);
    openWindow(datas.setWindowState, "window2", 150, 150, 200, 200);
    openWindow(datas.setWindowState, "window3", 200, 200, 200, 200);
    await wait();

    // Assert - 3つのウィンドウが開いている
    expect(datas.isWindowOpen("window1")).toBe(true);
    expect(datas.isWindowOpen("window2")).toBe(true);
    expect(datas.isWindowOpen("window3")).toBe(true);

    // Act - 4つ目のウィンドウを開く
    openWindow(datas.setWindowState, "window4", 250, 250, 200, 200);
    await wait();

    // Assert - 1つ目のウィンドウが閉じられる
    expect(datas.isWindowOpen("window1")).toBe(false);
    expect(datas.isWindowOpen("window2")).toBe(true);
    expect(datas.isWindowOpen("window3")).toBe(true);
    expect(datas.isWindowOpen("window4")).toBe(true);
  },
};

const SingleWindowClosesWhenZIndexLimitExceededDatas = {
  getWindowState: defaultGetWindowState as GetWindowStateType,
  setWindowState: (() => null) as SetWindowStateType,
  isWindowOpen: (() => false) as (key: string) => boolean,
};

export const SingleWindowClosesWhenZIndexLimitExceeded: Story = {
  render: () => {
    const datas = SingleWindowClosesWhenZIndexLimitExceededDatas;
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();
    datas.getWindowState = (key: string) => getWindowState(key);
    datas.setWindowState = setWindowState;
    datas.isWindowOpen = (key: string) => {
      const state = getWindowState(key);
      return state?.open || false;
    };

    return (
      <WindowContext
        dispatcher={stateDispatcher}
        z-index-min={1}
        z-index-max={1}
      >
        <Window key="window1" title="Window 1" />
        <Window key="window2" title="Window 2" />
      </WindowContext>
    );
  },
  play: async () => {
    // WindowContextのz-index-minとz-index-maxに1を指定する。
    // 1つウィンドウを開いている状態でさらにもう1つウィンドウを開くと、最初のウィンドウが閉じる。
    // Arrange
    const datas = SingleWindowClosesWhenZIndexLimitExceededDatas;

    // Act - 1つ目のウィンドウを開く
    openWindow(datas.setWindowState, "window1", 100, 100, 200, 200);
    await wait();

    // Assert - 1つ目のウィンドウが開いている
    expect(datas.isWindowOpen("window1")).toBe(true);

    // Act - 2つ目のウィンドウを開く
    openWindow(datas.setWindowState, "window2", 150, 150, 200, 200);
    await wait();

    // Assert - 1つ目のウィンドウが閉じられる
    expect(datas.isWindowOpen("window1")).toBe(false);
    expect(datas.isWindowOpen("window2")).toBe(true);
  },
};
