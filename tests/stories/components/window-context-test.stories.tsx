import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";
import { useEffect, useRef } from "react";
import type { WindowElement } from "@/components/window";
import { Window, WindowContext } from "@/components/window";
import { wait } from "../utils/wait";
import {
  getWindowPosition,
  getWindowSize,
  getWindowZIndex,
} from "../utils/window-utils";

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

const WindowUsesDefaultPositionAndSizeDatas = {
  getWindowElement: (() => null) as () => WindowElement | null,
  getWindowPosition: (() => ({ x: 0, y: 0 })) as () => { x: number; y: number },
  getWindowSize: (() => ({ width: 0, height: 0 })) as () => {
    width: number;
    height: number;
  },
};

export const WindowUsesDefaultPositionAndSize: Story = {
  render: () => {
    const datas = WindowUsesDefaultPositionAndSizeDatas;
    const windowRef = useRef<WindowElement>(null);
    datas.getWindowElement = () => windowRef.current;
    datas.getWindowPosition = () => getWindowPosition(windowRef.current);
    datas.getWindowSize = () => getWindowSize(windowRef.current);
    useEffect(() => {
      windowRef.current?.setWindowState({ open: true });
    }, []);
    return (
      <WindowContext
        defaultWindowPosition={{ x: 150, y: 150 }}
        defaultWindowSize={{ width: 300, height: 300 }}
      >
        <Window windowKey="window1" title="title" ref={windowRef} />
      </WindowContext>
    );
  },
  play: async () => {
    // positionとstyleを指定せずにsetWindowStateでウィンドウを開き、styleから値を取得する。
    // 返り値とWindowsRootのデフォルト値が一致する。
    // Arrange
    const datas = WindowUsesDefaultPositionAndSizeDatas;
    const windowElement = datas.getWindowElement();
    // Act
    windowElement?.setWindowState({ open: true });
    await wait();
    // Assert
    const position = datas.getWindowPosition();
    const size = datas.getWindowSize();
    expect(position.x).toBe(150);
    expect(position.y).toBe(150);
    expect(size.width).toBe(300);
    expect(size.height).toBe(300);
  },
};

const WindowUsesCustomPositionAndSizeDatas = {
  getWindowElement: (() => null) as () => WindowElement | null,
  getWindowPosition: (() => ({ x: 0, y: 0 })) as () => { x: number; y: number },
  getWindowSize: (() => ({ width: 0, height: 0 })) as () => {
    width: number;
    height: number;
  },
};

export const WindowUsesCustomPositionAndSize: Story = {
  render: () => {
    const datas = WindowUsesCustomPositionAndSizeDatas;
    const windowRef = useRef<WindowElement>(null);
    datas.getWindowElement = () => windowRef.current;
    datas.getWindowPosition = () => getWindowPosition(windowRef.current);
    datas.getWindowSize = () => getWindowSize(windowRef.current);
    return (
      <WindowContext>
        <Window windowKey="window1" title="title" ref={windowRef} />
      </WindowContext>
    );
  },
  play: async () => {
    // positionとsizeを指定してsetWindowStateでウィンドウを開き、styleから値を取得する。
    // 指定した位置・サイズと一致する。
    // Arrange
    const datas = WindowUsesCustomPositionAndSizeDatas;
    const windowElement = datas.getWindowElement();
    // Act
    windowElement?.setWindowState({
      open: true,
      position: { x: 200, y: 200 },
      size: { width: 400, height: 400 },
    });
    await wait();
    // Assert
    const position = datas.getWindowPosition();
    const size = datas.getWindowSize();
    expect(position.x).toBe(200);
    expect(position.y).toBe(200);
    expect(size.width).toBe(400);
    expect(size.height).toBe(400);
  },
};

const WindowRemembersPreviousPositionAndSizeDatas = {
  getWindowElement: (() => null) as () => WindowElement | null,
  getWindowPosition: (() => ({ x: 0, y: 0 })) as () => { x: number; y: number },
  getWindowSize: (() => ({ width: 0, height: 0 })) as () => {
    width: number;
    height: number;
  },
};

export const WindowRemembersPreviousPositionAndSize: Story = {
  render: () => {
    const datas = WindowRemembersPreviousPositionAndSizeDatas;
    const windowRef = useRef<WindowElement>(null);
    datas.getWindowElement = () => windowRef.current;
    datas.getWindowPosition = () => getWindowPosition(windowRef.current);
    datas.getWindowSize = () => getWindowSize(windowRef.current);
    return (
      <WindowContext
        defaultWindowPosition={{ x: 150, y: 150 }}
        defaultWindowSize={{ width: 300, height: 300 }}
      >
        <Window windowKey="window1" title="title" ref={windowRef} />
      </WindowContext>
    );
  },
  play: async () => {
    // positionとstyleを指定してsetWindowStateでウィンドウを開き、閉じる。
    // 再度同じキーでsetWindowStateしウィンドウを開き、styleから値を取得する。
    // 最初に指定した位置・サイズと一致する。
    // Arrange
    const datas = WindowRemembersPreviousPositionAndSizeDatas;
    const windowElement = datas.getWindowElement();
    const customPosition = { x: 200, y: 200 };
    const customSize = { width: 400, height: 400 };
    // Act - カスタム位置・サイズで開く
    windowElement?.setWindowState({
      open: true,
      position: customPosition,
      size: customSize,
    });
    await wait();
    // Act - 閉じる
    windowElement?.setWindowState({ open: false });
    await wait();
    // Act - 再度開く（位置・サイズ指定なし）
    windowElement?.setWindowState({ open: true });
    await wait();
    // Assert - 前回の位置・サイズが記憶されている
    const position = datas.getWindowPosition();
    const size = datas.getWindowSize();
    expect(position.x).toBe(customPosition.x);
    expect(position.y).toBe(customPosition.y);
    expect(size.width).toBe(customSize.width);
    expect(size.height).toBe(customSize.height);
  },
};

const WindowClosesWhenZIndexLimitExceededDatas = {
  getWindowElement: (() => null) as (
    key: "window1" | "window2" | "window3" | "window4",
  ) => WindowElement | null,
  isWindowOpen: (() => false) as (
    key: "window1" | "window2" | "window3" | "window4",
  ) => boolean,
};

export const WindowClosesWhenZIndexLimitExceeded: Story = {
  render: () => {
    const datas = WindowClosesWhenZIndexLimitExceededDatas;
    const window1Ref = useRef<WindowElement>(null);
    const window2Ref = useRef<WindowElement>(null);
    const window3Ref = useRef<WindowElement>(null);
    const window4Ref = useRef<WindowElement>(null);
    datas.getWindowElement = (key) => {
      if (key === "window1") {
        return window1Ref.current;
      }
      if (key === "window2") {
        return window2Ref.current;
      }
      if (key === "window3") {
        return window3Ref.current;
      }
      if (key === "window4") {
        return window4Ref.current;
      }
      return null;
    };
    datas.isWindowOpen = (key) => {
      const ref = datas.getWindowElement(key);
      return !!ref?.style;
    };
    return (
      <WindowContext zIndexMin={1} zIndexMax={3}>
        <Window windowKey="window1" title="Window 1" ref={window1Ref} />
        <Window windowKey="window2" title="Window 2" ref={window2Ref} />
        <Window windowKey="window3" title="Window 3" ref={window3Ref} />
        <Window windowKey="window4" title="Window 4" ref={window4Ref} />
      </WindowContext>
    );
  },
  play: async () => {
    // WindowContextのzIndexMinに1を、zIndexMaxに3を指定する。
    // 3つのウィンドウを開いている状態でさらにもう1つウィンドウを開くと、1つ目のウィンドウが閉じる。
    // Arrange
    const datas = WindowClosesWhenZIndexLimitExceededDatas;
    // Act - 3つのウィンドウを開く
    datas.getWindowElement("window1")?.setWindowState({
      open: true,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
    });
    datas.getWindowElement("window2")?.setWindowState({
      open: true,
      position: { x: 150, y: 150 },
      size: { width: 200, height: 200 },
    });
    datas.getWindowElement("window3")?.setWindowState({
      open: true,
      position: { x: 200, y: 200 },
      size: { width: 200, height: 200 },
    });
    await wait();
    // Assert - 3つのウィンドウが開いている
    expect(datas.isWindowOpen("window1")).toBe(true);
    expect(datas.isWindowOpen("window2")).toBe(true);
    expect(datas.isWindowOpen("window3")).toBe(true);
    // Act - 4つ目のウィンドウを開く
    datas.getWindowElement("window4")?.setWindowState({
      open: true,
      position: { x: 250, y: 250 },
      size: { width: 200, height: 200 },
    });
    await wait();
    // Assert - 1つ目のウィンドウが閉じられる
    expect(datas.isWindowOpen("window1")).toBe(false);
    expect(datas.isWindowOpen("window2")).toBe(true);
    expect(datas.isWindowOpen("window3")).toBe(true);
    expect(datas.isWindowOpen("window4")).toBe(true);
  },
};

const SingleWindowClosesWhenZIndexLimitExceededDatas = {
  getWindowElement: (() => null) as (
    key: "window1" | "window2",
  ) => WindowElement | null,
  isWindowOpen: (() => false) as (key: "window1" | "window2") => boolean,
};

export const SingleWindowClosesWhenZIndexLimitExceeded: Story = {
  render: () => {
    const datas = SingleWindowClosesWhenZIndexLimitExceededDatas;
    const window1Ref = useRef<WindowElement>(null);
    const window2Ref = useRef<WindowElement>(null);
    datas.getWindowElement = (key) => {
      if (key === "window1") {
        return window1Ref.current;
      }
      if (key === "window2") {
        return window2Ref.current;
      }
      return null;
    };
    datas.isWindowOpen = (key) => {
      const ref = datas.getWindowElement(key);
      return !!ref?.style;
    };
    return (
      <WindowContext zIndexMin={1} zIndexMax={1}>
        <Window windowKey="window1" title="Window 1" ref={window1Ref} />
        <Window windowKey="window2" title="Window 2" ref={window2Ref} />
      </WindowContext>
    );
  },
  play: async () => {
    // WindowContextのzIndexMinとzIndexMaxに1を指定する。
    // 1つウィンドウを開いている状態でさらにもう1つウィンドウを開くと、最初のウィンドウが閉じる。
    // Arrange
    const datas = SingleWindowClosesWhenZIndexLimitExceededDatas;
    // Act - 1つ目のウィンドウを開く
    datas.getWindowElement("window1")?.setWindowState({
      open: true,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
    });
    await wait();
    // Assert - 1つ目のウィンドウが開いている
    expect(datas.isWindowOpen("window1")).toBe(true);
    // Act - 2つ目のウィンドウを開く
    datas.getWindowElement("window2")?.setWindowState({
      open: true,
      position: { x: 150, y: 150 },
      size: { width: 200, height: 200 },
    });
    await wait();
    // Assert - 1つ目のウィンドウが閉じられる
    expect(datas.isWindowOpen("window1")).toBe(false);
    expect(datas.isWindowOpen("window2")).toBe(true);
  },
};

const WindowMovesToFrontWhenSetWindowStateCalledDatas = {
  getWindowElement: (() => null) as (
    key: "window1" | "window2" | "window3",
  ) => WindowElement | null,
  getWindowZIndex: (() => 0) as (
    key: "window1" | "window2" | "window3",
  ) => number | null,
};

export const WindowMovesToFrontWhenSetWindowStateCalled: Story = {
  render: () => {
    const datas = WindowMovesToFrontWhenSetWindowStateCalledDatas;
    const window1Ref = useRef<WindowElement>(null);
    const window2Ref = useRef<WindowElement>(null);
    const window3Ref = useRef<WindowElement>(null);
    datas.getWindowElement = (key) => {
      if (key === "window1") {
        return window1Ref.current;
      }
      if (key === "window2") {
        return window2Ref.current;
      }
      if (key === "window3") {
        return window3Ref.current;
      }
      return null;
    };
    datas.getWindowZIndex = (key) =>
      getWindowZIndex(datas.getWindowElement(key));
    // 3つのウィンドウを開く
    useEffect(() => {
      window1Ref.current?.setWindowState({
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
      window2Ref.current?.setWindowState({
        open: true,
        position: { x: 150, y: 150 },
        size: { width: 200, height: 200 },
      });
      window3Ref.current?.setWindowState({
        open: true,
        position: { x: 200, y: 200 },
        size: { width: 200, height: 200 },
      });
    }, []);
    return (
      <WindowContext>
        <Window windowKey="window1" title="window1" ref={window1Ref} />
        <Window windowKey="window2" title="window2" ref={window2Ref} />
        <Window windowKey="window3" title="window3" ref={window3Ref} />
      </WindowContext>
    );
  },
  play: async () => {
    // 3つのウィンドウを開く。1つ目のウィンドウのキーでsetWindowStateする。
    // 1つ目のウィンドウが最前面に移動する。
    // Arrange
    const datas = WindowMovesToFrontWhenSetWindowStateCalledDatas;
    // Act - 1つ目のウィンドウを再度開く
    datas.getWindowElement("window1")?.setWindowState({ open: true });
    await wait();
    // Assert - 1つ目のウィンドウがフォーカスされる(z-indexが最も大きい)
    const zIndex1 = datas.getWindowZIndex("window1");
    const zIndex2 = datas.getWindowZIndex("window2");
    const zIndex3 = datas.getWindowZIndex("window3");
    expect(zIndex1).not.toBeNull();
    expect(zIndex2).not.toBeNull();
    expect(zIndex3).not.toBeNull();
    if (zIndex1 !== null && zIndex2 !== null && zIndex3 !== null) {
      expect(zIndex1).toBeGreaterThan(zIndex2);
      expect(zIndex1).toBeGreaterThan(zIndex3);
    }
  },
};

const FocusTransfersToPreviousWindowWhenFrontWindowClosesDatas = {
  getWindowElement: (() => null) as (
    key: "window1" | "window2" | "window3",
  ) => WindowElement | null,
  getWindowZIndex: (() => 0) as (
    key: "window1" | "window2" | "window3",
  ) => number | null,
};

export const FocusTransfersToPreviousWindowWhenFrontWindowCloses: Story = {
  render: () => {
    const datas = FocusTransfersToPreviousWindowWhenFrontWindowClosesDatas;
    const window1Ref = useRef<WindowElement>(null);
    const window2Ref = useRef<WindowElement>(null);
    const window3Ref = useRef<WindowElement>(null);
    datas.getWindowElement = (key) => {
      if (key === "window1") {
        return window1Ref.current;
      }
      if (key === "window2") {
        return window2Ref.current;
      }
      if (key === "window3") {
        return window3Ref.current;
      }
      return null;
    };
    datas.getWindowZIndex = (key) =>
      getWindowZIndex(datas.getWindowElement(key));
    // 3つのウィンドウを開く
    useEffect(() => {
      window1Ref.current?.setWindowState({
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
      window2Ref.current?.setWindowState({
        open: true,
        position: { x: 150, y: 150 },
        size: { width: 200, height: 200 },
      });
      window3Ref.current?.setWindowState({
        open: true,
        position: { x: 200, y: 200 },
        size: { width: 200, height: 200 },
      });
    }, []);
    return (
      <WindowContext>
        <Window windowKey="window1" title="window1" ref={window1Ref} />
        <Window windowKey="window2" title="window2" ref={window2Ref} />
        <Window windowKey="window3" title="window3" ref={window3Ref} />
      </WindowContext>
    );
  },
  play: async () => {
    // 3つのウィンドウを開き、setWindowStateで最前面のウィンドウを閉じる。
    // 2個目に開いたウィンドウのヘッダに最前面アイコンが表示され、フォーカスされる。
    // Arrange
    const datas = FocusTransfersToPreviousWindowWhenFrontWindowClosesDatas;
    // Act - 最前面のウィンドウを閉じる
    datas.getWindowElement("window3")?.setWindowState({ open: false });
    await wait();
    // Assert - 2つ目のウィンドウがフォーカスされる(z-indexが最も大きい)
    const zIndex1 = datas.getWindowZIndex("window1");
    const zIndex2 = datas.getWindowZIndex("window2");
    expect(zIndex1).not.toBeNull();
    expect(zIndex2).not.toBeNull();
    if (zIndex1 !== null && zIndex2 !== null) {
      expect(zIndex2).toBeGreaterThan(zIndex1);
    }
  },
};

const FocusRemainsOnFrontWindowWhenNonFrontWindowClosesDatas = {
  getWindowElement: (() => null) as (
    key: "window1" | "window2" | "window3",
  ) => WindowElement | null,
  getWindowZIndex: (() => 0) as (
    key: "window1" | "window2" | "window3",
  ) => number | null,
};

export const FocusRemainsOnFrontWindowWhenNonFrontWindowCloses: Story = {
  render: () => {
    const datas = FocusRemainsOnFrontWindowWhenNonFrontWindowClosesDatas;
    const window1Ref = useRef<WindowElement>(null);
    const window2Ref = useRef<WindowElement>(null);
    const window3Ref = useRef<WindowElement>(null);
    datas.getWindowElement = (key) => {
      if (key === "window1") {
        return window1Ref.current;
      }
      if (key === "window2") {
        return window2Ref.current;
      }
      if (key === "window3") {
        return window3Ref.current;
      }
      return null;
    };
    datas.getWindowZIndex = (key) =>
      getWindowZIndex(datas.getWindowElement(key));
    // 3つのウィンドウを開く
    useEffect(() => {
      window1Ref.current?.setWindowState({
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
      window2Ref.current?.setWindowState({
        open: true,
        position: { x: 150, y: 150 },
        size: { width: 200, height: 200 },
      });
      window3Ref.current?.setWindowState({
        open: true,
        position: { x: 200, y: 200 },
        size: { width: 200, height: 200 },
      });
    }, []);
    return (
      <WindowContext>
        <Window windowKey="window1" title="window1" ref={window1Ref} />
        <Window windowKey="window2" title="window2" ref={window2Ref} />
        <Window windowKey="window3" title="window3" ref={window3Ref} />
      </WindowContext>
    );
  },
  play: async () => {
    // 3つのウィンドウを開き、setWindowStateで2個目に開いたウィンドウを閉じる。
    // 3個目に開いたウィンドウのヘッダに最前面アイコンが表示され続け、フォーカスが移動しない。
    // Arrange
    const datas = FocusRemainsOnFrontWindowWhenNonFrontWindowClosesDatas;
    // Act - 2つ目のウィンドウを閉じる
    datas.getWindowElement("window2")?.setWindowState({ open: false });
    await wait();
    // Assert - 3つ目のウィンドウがフォーカスされ続ける
    const zIndex1 = datas.getWindowZIndex("window1");
    const zIndex3 = datas.getWindowZIndex("window3");
    expect(zIndex1).not.toBeNull();
    expect(zIndex3).not.toBeNull();
    if (zIndex1 !== null && zIndex3 !== null) {
      expect(zIndex3).toBeGreaterThan(zIndex1);
    }
  },
};
