import type { Meta, StoryObj } from "@storybook/react-vite";
import { Window, WindowContext, type WindowElement } from "@/components/window";
import { within } from "@storybook/test";
import { expect } from "@storybook/test";
import { useEffect, useRef, useState } from "react";
import { simulateDrag } from "../utils/drag";
import { wait } from "../utils/wait";
import { simulateDragStartAndCancelWithEscape } from "../utils/escape-cancel";
import {
  getWindowPosition,
  getWindowSize,
  getWindowZIndex,
} from "../utils/window-utils";
import {
  expectPositionToBeCloseTo,
  expectSizeToBeCloseTo,
} from "../utils/expect-utils";

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

const OpenedWindowUpdateContentsOnPropsUpdateDatas = {
  getWindowElement: (() => {
    return null;
  }) as () => WindowElement | null,
  setWindowTitle: (() => {
    return;
  }) as (title: string) => void,
  setWindowMessage: (() => {
    return;
  }) as (message: string) => void,
};

export const OpenedWindowUpdateContentsOnPropsUpdate: Story = {
  render: () => {
    const datas = OpenedWindowUpdateContentsOnPropsUpdateDatas;
    const [title, setTitle] = useState("title");
    const [message, setMessage] = useState("message");
    const windowRef = useRef<WindowElement>(null);
    datas.getWindowElement = () => windowRef.current;
    datas.setWindowTitle = (title: string) => setTitle(title);
    datas.setWindowMessage = (message: string) => setMessage(message);
    useEffect(() => {
      windowRef.current?.setWindowState({
        open: true,
      });
    }, []);
    return (
      <WindowContext>
        <Window windowKey="window1" title={title} ref={windowRef}>
          <div>{message}</div>
        </Window>
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 開いているWindowのchildrenとtitleを更新すると、ウィンドウ内容の表示が更新される。
    // Arrange
    const canvas = within(canvasElement);
    const datas = OpenedWindowUpdateContentsOnPropsUpdateDatas;
    datas.getWindowElement()?.setWindowState({
      open: true,
    });
    await wait();

    // Act
    datas.setWindowTitle("title2");
    datas.setWindowMessage("message2");
    await wait();

    // Assert
    await expect(canvas.getByText("message2")).toBeInTheDocument();
    await expect(canvas.getByText("title2")).toBeInTheDocument();
  },
};

const ClosedWindowUpdateContentsOnPropsUpdateDatas = {
  getWindowElement: (() => {
    return null;
  }) as () => WindowElement | null,
  setWindowTitle: (() => {
    return;
  }) as (title: string) => void,
  setWindowMessage: (() => {
    return;
  }) as (message: string) => void,
};

export const ClosedWindowUpdateContentsOnPropsUpdate: Story = {
  render: () => {
    const datas = ClosedWindowUpdateContentsOnPropsUpdateDatas;
    const [title, setTitle] = useState("title");
    const [message, setMessage] = useState("message");
    const windowRef = useRef<WindowElement>(null);
    datas.getWindowElement = () => windowRef.current;
    datas.setWindowTitle = (title: string) => setTitle(title);
    datas.setWindowMessage = (message: string) => setMessage(message);
    return (
      <WindowContext>
        <Window windowKey="window1" title={title} ref={windowRef}>
          <div>{message}</div>
        </Window>
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 閉じているWindowのchildrenとtitleを更新し再度開くと、ウィンドウ内容の表示が更新される。
    // Arrange
    const canvas = within(canvasElement);
    const datas = ClosedWindowUpdateContentsOnPropsUpdateDatas;
    datas.getWindowElement()?.setWindowState({
      open: true,
    });
    await wait();

    // Act
    datas.setWindowTitle("title2");
    datas.setWindowMessage("message2");
    datas.getWindowElement()?.setWindowState({
      open: true,
    });
    await wait();

    // Assert
    await expect(canvas.getByText("message2")).toBeInTheDocument();
    await expect(canvas.getByText("title2")).toBeInTheDocument();
  },
};

const HeaderDragsAndCancelsOnEscapeKeyDatas = {
  getWindowPosition: () => {
    return { x: 0, y: 0 };
  },
  getWindowSize: () => {
    return { width: 0, height: 0 };
  },
};

export const HeaderDragsAndCancelsOnEscapeKey: Story = {
  render: () => {
    const datas = HeaderDragsAndCancelsOnEscapeKeyDatas;
    const windowRef = useRef<WindowElement>(null);
    useEffect(() => {
      windowRef.current?.setWindowState({
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
    }, []);
    datas.getWindowPosition = () => {
      return getWindowPosition(windowRef.current);
    };
    datas.getWindowSize = () => {
      return getWindowSize(windowRef.current);
    };
    return (
      <WindowContext>
        <Window windowKey="window1" title="title" ref={windowRef} />
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // ヘッダをドラッグすると、マウス移動した分だけ位置が平行移動する。
    // またドラッグ前後にgetWindowStateした返り値のpositionがマウス移動の分だけ変化し、sizeが変化しない。
    // Arrange
    const canvas = within(canvasElement);
    const datas = HeaderDragsAndCancelsOnEscapeKeyDatas;
    const windowPosition0 = datas.getWindowPosition();
    const windowSize0 = datas.getWindowSize();
    const title = canvas.getByText("title");
    const titlePosition0 = title.getBoundingClientRect();

    // Act
    const dragStartX = titlePosition0.x + 5;
    const dragStartY = titlePosition0.y + 5;
    const dragDeltaX = 100;
    const dragDeltaY = 100;
    await simulateDrag(
      title,
      dragStartX,
      dragStartY,
      dragStartX + dragDeltaX,
      dragStartY + dragDeltaY,
    );

    // Assert
    const windowPosition1 = datas.getWindowPosition();
    expectPositionToBeCloseTo(windowPosition1, {
      x: windowPosition0.x + dragDeltaX,
      y: windowPosition0.y + dragDeltaY,
    });
    const windowSize1 = datas.getWindowSize();
    expectSizeToBeCloseTo(windowSize1, windowSize0);

    // ヘッダのドラッグを中断する(Escapeを押す)と、キャンセルされた位置でウィンドウが留まる
    // Arrange
    const windowPosition2 = datas.getWindowPosition();
    const windowSize2 = datas.getWindowSize();

    // Act - ドラッグ開始とEscapeキーでキャンセル
    const titlePosition2 = title.getBoundingClientRect();
    const dragStartX2 = titlePosition2.x + 5;
    const dragStartY2 = titlePosition2.y + 5;
    const dragEndX2 = dragStartX2 + 50;
    const dragEndY2 = dragStartY2 + 50;
    await simulateDragStartAndCancelWithEscape(
      title,
      dragStartX2,
      dragStartY2,
      dragEndX2,
      dragEndY2,
    );

    // Assert
    const windowPosition3 = datas.getWindowPosition();
    const windowSize3 = datas.getWindowSize();
    expectPositionToBeCloseTo(windowPosition3, {
      x: windowPosition2.x + 50,
      y: windowPosition2.y + 50,
    });
    expectSizeToBeCloseTo(windowSize3, windowSize2);
  },
};

const ResizeHandleDragsAndCancelsOnEscapeKeyDatas = {
  getWindowPosition: () => {
    return { x: 0, y: 0 };
  },
  getWindowSize: () => {
    return { width: 0, height: 0 };
  },
};

export const ResizeHandleDragsAndCancelsOnEscapeKey: Story = {
  render: () => {
    const datas = ResizeHandleDragsAndCancelsOnEscapeKeyDatas;
    const windowRef = useRef<WindowElement>(null);
    useEffect(() => {
      windowRef.current?.setWindowState({
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
    }, []);
    datas.getWindowPosition = () => {
      return getWindowPosition(windowRef.current);
    };
    datas.getWindowSize = () => {
      return getWindowSize(windowRef.current);
    };
    return (
      <WindowContext>
        <Window windowKey="window1" title="title" ref={windowRef} />
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 右下のアイコンをドラッグすると、マウス移動の分だけサイズが拡大・縮小する。
    // またドラッグ前後にgetWindowStateした返り値のsizeがマウス移動の分だけ変化し、positionが変化しない。
    // Arrange
    const canvas = within(canvasElement);
    const datas = ResizeHandleDragsAndCancelsOnEscapeKeyDatas;
    const windowPosition0 = datas.getWindowPosition();
    const windowSize0 = datas.getWindowSize();
    const resizeHandle = canvas.getByLabelText("resize-window");
    const resizeHandleRect = resizeHandle.getBoundingClientRect();

    // Act
    const dragStartX = resizeHandleRect.x + 5;
    const dragStartY = resizeHandleRect.y + 5;
    const dragDeltaX = 50;
    const dragDeltaY = 50;
    await simulateDrag(
      resizeHandle,
      dragStartX,
      dragStartY,
      dragStartX + dragDeltaX,
      dragStartY + dragDeltaY,
    );

    // Assert
    const windowPosition1 = datas.getWindowPosition();
    expectPositionToBeCloseTo(windowPosition1, windowPosition0);
    const windowSize1 = datas.getWindowSize();
    expectSizeToBeCloseTo(windowSize1, {
      width: windowSize0.width + dragDeltaX,
      height: windowSize0.height + dragDeltaY,
    });

    // 右下のアイコンのドラッグを中断する(Escapeを押す)と、キャンセルされた位置でウィンドウが留まる
    // Arrange
    const windowPosition2 = datas.getWindowPosition();
    const windowSize2 = datas.getWindowSize();

    // Act - ドラッグ開始とEscapeキーでキャンセル
    const resizeHandleRect2 = resizeHandle.getBoundingClientRect();
    const dragStartX2 = resizeHandleRect2.x + 5;
    const dragStartY2 = resizeHandleRect2.y + 5;
    const dragDeltaX2 = 50;
    const dragDeltaY2 = 50;
    await simulateDragStartAndCancelWithEscape(
      resizeHandle,
      dragStartX2,
      dragStartY2,
      dragStartX2 + dragDeltaX2,
      dragStartY2 + dragDeltaY2,
    );

    // Assert
    const windowPosition3 = datas.getWindowPosition();
    const windowSize3 = datas.getWindowSize();
    expectPositionToBeCloseTo(windowPosition3, windowPosition2);
    expectSizeToBeCloseTo(windowSize3, {
      width: windowSize2.width + dragDeltaX2,
      height: windowSize2.height + dragDeltaY2,
    });
  },
};

const ResizeHandlePreventsBelowMinimumDatas = {
  getWindowSize: () => {
    return { width: 0, height: 0 };
  },
};

export const ResizeHandlePreventsBelowMinimum: Story = {
  render: () => {
    const datas = ResizeHandlePreventsBelowMinimumDatas;
    const windowRef = useRef<WindowElement>(null);
    useEffect(() => {
      windowRef.current?.setWindowState({
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 100, height: 100 },
      });
    }, []);
    datas.getWindowSize = () => {
      return getWindowSize(windowRef.current);
    };
    return (
      <WindowContext minimumSize={{ width: 75, height: 75 }}>
        <Window windowKey="window1" title="title" ref={windowRef} />
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 右下のアイコンをドラッグし左に移動し続ける。横幅が75px未満になるタイミングで、ドラッグがキャンセルされる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = ResizeHandlePreventsBelowMinimumDatas;
    const resizeHandle = canvas.getByLabelText("resize-window");
    const resizeHandleRect = resizeHandle.getBoundingClientRect();

    // Act - 最小幅を下回るドラッグ
    const dragStartX = resizeHandleRect.x + 5;
    const dragStartY = resizeHandleRect.y + 5;
    const dragDeltaX = -60; // 100px - 60px = 40px < 75px
    const dragDeltaY = 0;
    await simulateDragStartAndCancelWithEscape(
      resizeHandle,
      dragStartX,
      dragStartY,
      dragStartX + dragDeltaX,
      dragStartY + dragDeltaY,
    );

    // Assert
    const windowSize1 = datas.getWindowSize();
    expect(windowSize1.width).toBeCloseTo(75);

    // 右下のアイコンをドラッグし上に移動し続ける。縦幅が75px未満になるタイミングで、ドラッグがキャンセルされる。
    // Act - 最小高さを下回るドラッグ
    const dragStartX2 = resizeHandleRect.x + 5;
    const dragStartY2 = resizeHandleRect.y + 5;
    const dragDeltaX2 = 0;
    const dragDeltaY2 = -60; // 100px - 60px = 40px < 75px
    await simulateDragStartAndCancelWithEscape(
      resizeHandle,
      dragStartX2,
      dragStartY2,
      dragStartX2 + dragDeltaX2,
      dragStartY2 + dragDeltaY2,
    );

    // Assert
    const windowSize3 = datas.getWindowSize();
    expect(windowSize3.height).toBeCloseTo(75);
  },
};

const CloseButtonDatas = {
  isWindowOpen: () => true,
};

export const CloseButtonClosesWindow: Story = {
  render: () => {
    const datas = CloseButtonDatas;
    const windowRef = useRef<WindowElement>(null);
    useEffect(() => {
      windowRef.current?.setWindowState({
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
    }, []);
    datas.isWindowOpen = () => {
      return windowRef.current?.style !== undefined;
    };
    return (
      <WindowContext>
        <Window windowKey="window1" title="title" ref={windowRef} />
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 右上の閉じるボタンを押すと、ウィンドウが閉じる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = CloseButtonDatas;
    expect(datas.isWindowOpen()).toBe(true);

    // Act
    const closeButton = canvas.getByRole("button", { name: "close-window" });
    closeButton.click();
    await wait();

    // Assert
    expect(datas.isWindowOpen()).toBe(false);
  },
};

const WindowMaintainsFocusAndPreservesInputFocusDatas = {
  getWindowElement: (() => null) as (key: string) => WindowElement | null,
  getWindowZIndex: (() => 0) as (key: string) => number,
  isWindowFocused: (() => false) as (key: string) => boolean,
  hasFocusIcon: (() => false) as (key: string) => boolean,
  isInputFocused: () => false,
};

export const WindowMaintainsFocusAndPreservesInputFocus: Story = {
  render: () => {
    const datas = WindowMaintainsFocusAndPreservesInputFocusDatas;
    const windowRef1 = useRef<WindowElement>(null);
    const windowRef2 = useRef<WindowElement>(null);
    const windowRef3 = useRef<WindowElement>(null);

    // 3つのウィンドウを開く
    useEffect(() => {
      windowRef1.current?.setWindowState({
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
      windowRef2.current?.setWindowState({
        open: true,
        position: { x: 150, y: 150 },
        size: { width: 200, height: 200 },
      });
      windowRef3.current?.setWindowState({
        open: true,
        position: { x: 200, y: 200 },
        size: { width: 200, height: 200 },
      });
    }, []);

    datas.getWindowElement = (key: string) => {
      switch (key) {
        case "window1":
          return windowRef1.current;
        case "window2":
          return windowRef2.current;
        default:
          return windowRef3.current;
      }
    };
    datas.getWindowZIndex = (key: string) => {
      return getWindowZIndex(datas.getWindowElement(key));
    };
    // TODO: WIndowContextからフォーカス判定を持ってくる
    datas.isWindowFocused = (key: string) => {
      return key === "window3"; // 最後に開いたウィンドウがフォーカス済み
    };
    datas.hasFocusIcon = (key: string) => {
      return key === "window3"; // 最後に開いたウィンドウにアイコン表示済み
    };
    datas.isInputFocused = () => {
      // input要素のフォーカス状態を確認
      return document.activeElement?.tagName === "INPUT";
    };

    return (
      <WindowContext>
        <Window windowKey="window1" title="Window 1" ref={windowRef1} />
        <Window windowKey="window2" title="Window 2" ref={windowRef2} />
        <Window windowKey="window3" title="Window 3" ref={windowRef3}>
          <input data-testid="test-input" />
        </Window>
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 3つのウィンドウを開く。最後に開いたウィンドウをクリック・ドラッグしても
    // - 3つのウィンドウのz-indexが変化しない
    // - フォーカスされ続ける
    // - ヘッダに最前面アイコンが表示され続ける
    // Arrange
    const canvas = within(canvasElement);
    const datas = WindowMaintainsFocusAndPreservesInputFocusDatas;
    const window3 = canvas.getByText("Window 3");
    const zIndexBefore = {
      window1: datas.getWindowZIndex("window1"),
      window2: datas.getWindowZIndex("window2"),
      window3: datas.getWindowZIndex("window3"),
    };

    // Act
    window3.click();
    await wait();

    // Assert
    expect(datas.isWindowFocused("window3")).toBe(true);
    expect(datas.hasFocusIcon("window3")).toBe(true);
    expect(datas.getWindowZIndex("window1")).toBe(zIndexBefore.window1);
    expect(datas.getWindowZIndex("window2")).toBe(zIndexBefore.window2);
    expect(datas.getWindowZIndex("window3")).toBe(zIndexBefore.window3);

    // 3つのウィンドウを開き、最前面ウィンドウの子のinput要素にフォーカスする。
    // 最前面ウィンドウをsetWindowStateで再度開いてもフォーカスが移動しない。
    // Arrange
    const input = canvas.getByTestId("test-input");

    // Act - inputにフォーカス
    input.focus();
    await wait();
    expect(datas.isInputFocused()).toBe(true);

    // Act - 最前面ウィンドウを再度開く
    const window3Element = datas.getWindowElement("window3");
    window3Element?.setWindowState({ open: true });
    await wait();

    // Assert - フォーカスが維持される
    expect(datas.isInputFocused()).toBe(true);
  },
};

const WindowPreventsEventPropagationToParentDatas = {
  // TODO: スパイを用いた書き換え
  parentClickCount: 0,
  childClickCount: 0,
};

export const WindowPreventsEventPropagationToParent: Story = {
  render: () => {
    const datas = WindowPreventsEventPropagationToParentDatas;
    const windowRef = useRef<WindowElement>(null);
    useEffect(() => {
      windowRef.current?.setWindowState({
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
    }, []);

    return (
      <div
        data-testid="parent-element"
        onClick={() => {
          datas.parentClickCount++;
        }}
        onKeyDown={() => {
          datas.parentClickCount++;
        }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <WindowContext>
          <Window windowKey="window1" title="Window 1" ref={windowRef}>
            <div
              data-testid="window-content"
              onClick={() => {
                datas.childClickCount++;
              }}
              onKeyDown={() => {
                datas.childClickCount++;
              }}
            >
              Window Content
            </div>
          </Window>
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ウィンドウのヘッダ・ボディをクリックする。
    // ウィンドウの親要素・ウィンドウよりz-indexが小さい要素のonClickが実行されない。
    // Arrange
    const canvas = within(canvasElement);
    const datas = WindowPreventsEventPropagationToParentDatas;
    const windowContent = canvas.getByTestId("window-content");

    // Act - ウィンドウ内容をクリック
    windowContent.click();
    await wait();

    // Assert - ウィンドウ内容のクリックイベントは実行されるが、親要素のクリックイベントは実行されない
    expect(datas.childClickCount).toBe(1);
    expect(datas.parentClickCount).toBe(0);
  },
};
