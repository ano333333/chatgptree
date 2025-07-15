import type { Meta, StoryObj } from "@storybook/react-vite";
import { Window, WindowContext } from "@/components/window";
import useWindow from "@/hooks/use-window";
import { within } from "@storybook/test";
import { expect } from "@storybook/test";
import { useEffect, useState } from "react";
import { simulateDrag } from "../utils/drag";
import { wait } from "../utils/wait";
import { simulateDragStartAndCancelWithEscape } from "../utils/escape-cancel";
import { openWindow } from "../utils/window-utils";
import {
  expectPositionToBeCloseTo,
  expectSizeToBeCloseTo,
} from "../utils/expect-utils";
import type { SetWindowStateType } from "../utils/use-window-utils";

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
  openWindow: () => {
    return;
  },
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
    const { setWindowState, stateDispatcher } = useWindow();
    const [title, setTitle] = useState("title");
    const [message, setMessage] = useState("message");
    datas.openWindow = () => {
      setWindowState("window1", {
        open: true,
      });
    };
    datas.setWindowTitle = (title: string) => setTitle(title);
    datas.setWindowMessage = (message: string) => setMessage(message);
    useEffect(() => {
      setWindowState("window1", {
        open: true,
      });
    }, [setWindowState]);
    return (
      <WindowContext dispatcher={stateDispatcher}>
        <Window windowKey="window1" title={title}>
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
    datas.openWindow();
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
  openWindow: () => {
    return;
  },
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
    const { setWindowState, stateDispatcher } = useWindow();
    const [title, setTitle] = useState("title");
    const [message, setMessage] = useState("message");
    datas.openWindow = () => {
      setWindowState("window1", {
        open: true,
      });
    };
    datas.setWindowTitle = (title: string) => setTitle(title);
    datas.setWindowMessage = (message: string) => setMessage(message);
    return (
      <WindowContext dispatcher={stateDispatcher}>
        <Window windowKey="window1" title={title}>
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
    datas.openWindow();
    await wait();

    // Act
    datas.setWindowTitle("title2");
    datas.setWindowMessage("message2");
    datas.openWindow();
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
    const { setWindowState, getWindowState, stateDispatcher } = useWindow();
    useEffect(() => {
      setWindowState("window1", {
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
    }, [setWindowState]);
    datas.getWindowPosition = () => {
      const state = getWindowState("window1");
      if (!state.open) {
        throw new Error("Window is not open");
      }
      return state.position;
    };
    datas.getWindowSize = () => {
      const state = getWindowState("window1");
      if (!state.open) {
        throw new Error("Window is not open");
      }
      return state.size;
    };
    return (
      <WindowContext dispatcher={stateDispatcher}>
        <Window windowKey="window1" title="title" />
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
    const { setWindowState, getWindowState, stateDispatcher } = useWindow();
    useEffect(() => {
      setWindowState("window1", {
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
    }, [setWindowState]);
    datas.getWindowPosition = () => {
      const state = getWindowState("window1");
      if (!state.open) {
        throw new Error("Window is not open");
      }
      return state.position;
    };
    datas.getWindowSize = () => {
      const state = getWindowState("window1");
      if (!state.open) {
        throw new Error("Window is not open");
      }
      return state.size;
    };
    return (
      <WindowContext dispatcher={stateDispatcher}>
        <Window windowKey="window1" title="title" />
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
    const { setWindowState, getWindowState, stateDispatcher } = useWindow();
    useEffect(() => {
      setWindowState("window1", {
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 100, height: 100 },
      });
    }, [setWindowState]);
    datas.getWindowSize = () => {
      const state = getWindowState("window1");
      if (!state.open) {
        throw new Error("Window is not open");
      }
      return state.size;
    };
    return (
      <WindowContext
        dispatcher={stateDispatcher}
        width-min={50}
        height-min={50}
      >
        <Window windowKey="window1" title="title" />
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 右下のアイコンをドラッグし左に移動し続ける。横幅が50px未満になるタイミングで、ドラッグがキャンセルされる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = ResizeHandlePreventsBelowMinimumDatas;
    const resizeHandle = canvas.getByLabelText("resize-window");
    const resizeHandleRect = resizeHandle.getBoundingClientRect();

    // Act - 最小幅を下回るドラッグ
    const dragStartX = resizeHandleRect.x + 5;
    const dragStartY = resizeHandleRect.y + 5;
    const dragDeltaX = -60; // 100px - 60px = 40px < 50px
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
    expect(windowSize1.width).toBeCloseTo(50);

    // 右下のアイコンをドラッグし上に移動し続ける。縦幅が50px未満になるタイミングで、ドラッグがキャンセルされる。
    // Act - 最小高さを下回るドラッグ
    const dragStartX2 = resizeHandleRect.x + 5;
    const dragStartY2 = resizeHandleRect.y + 5;
    const dragDeltaX2 = 0;
    const dragDeltaY2 = -60; // 100px - 60px = 40px < 50px
    await simulateDragStartAndCancelWithEscape(
      resizeHandle,
      dragStartX2,
      dragStartY2,
      dragStartX2 + dragDeltaX2,
      dragStartY2 + dragDeltaY2,
    );

    // Assert
    const windowSize3 = datas.getWindowSize();
    expect(windowSize3.height).toBeCloseTo(50);
  },
};

const CloseButtonDatas = {
  isWindowOpen: () => true,
};

export const CloseButtonClosesWindow: Story = {
  render: () => {
    const datas = CloseButtonDatas;
    const { setWindowState, getWindowState, stateDispatcher } = useWindow();
    useEffect(() => {
      setWindowState("window1", {
        open: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
    }, [setWindowState]);
    datas.isWindowOpen = () => {
      const state = getWindowState("window1");
      return state.open;
    };
    return (
      <WindowContext dispatcher={stateDispatcher}>
        <Window windowKey="window1" title="title" />
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
  setWindowState: (() => null) as SetWindowStateType,
  getWindowZIndex: (() => 0) as (key: string) => number,
  isWindowFocused: (() => false) as (key: string) => boolean,
  hasFocusIcon: (() => false) as (key: string) => boolean,
  isInputFocused: () => false,
};

export const WindowMaintainsFocusAndPreservesInputFocus: Story = {
  render: () => {
    const datas = WindowMaintainsFocusAndPreservesInputFocusDatas;
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();

    // 3つのウィンドウを開く
    useEffect(() => {
      openWindow(setWindowState, "window1", 100, 100, 200, 200);
      openWindow(setWindowState, "window2", 150, 150, 200, 200);
      openWindow(setWindowState, "window3", 200, 200, 200, 200);
    }, [setWindowState]);

    datas.setWindowState = setWindowState;
    datas.getWindowZIndex = (key: string) => {
      const state = getWindowState(key);
      if (!state.open) {
        return 0;
      }
      return 0;
    };
    datas.isWindowFocused = (key: string) => {
      const state = getWindowState(key);
      if (!state.open) {
        return false;
      }
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
      <WindowContext dispatcher={stateDispatcher}>
        <Window windowKey="window1" title="Window 1" />
        <Window windowKey="window2" title="Window 2" />
        <Window windowKey="window3" title="Window 3">
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
    datas.setWindowState("window3", { open: true });
    await wait();

    // Assert - フォーカスが維持される
    expect(datas.isInputFocused()).toBe(true);
  },
};

const WindowPreservesDragStateOnReopenDatas = {
  isDragging: () => false,
};

export const WindowPreservesDragStateOnReopen: Story = {
  render: () => {
    const datas = WindowPreservesDragStateOnReopenDatas;
    const { setWindowState, stateDispatcher } = useWindow();

    // 3つのウィンドウを開く
    openWindow(setWindowState, "window1", 100, 100, 200, 200);
    openWindow(setWindowState, "window2", 150, 150, 200, 200);
    openWindow(setWindowState, "window3", 200, 200, 200, 200);

    datas.isDragging = () => {
      // ドラッグ状態の確認（実装に依存）
      return false;
    };

    return (
      <WindowContext dispatcher={stateDispatcher}>
        <Window windowKey="window1" title="Window 1" />
        <Window windowKey="window2" title="Window 2" />
        <Window windowKey="window3" title="Window 3" />
      </WindowContext>
    );
  },
  play: async ({ canvasElement }) => {
    // 3つのウィンドウを開く。最前面ウィンドウのドラッグ中に、
    // 最前面ウィンドウをsetWindowStateで再度開いてもドラッグが中断されない。
    // Arrange
    const canvas = within(canvasElement);
    const datas = WindowPreservesDragStateOnReopenDatas;
    const { setWindowState } = useWindow();
    const window3 = canvas.getByText("Window 3");

    // Act - ドラッグ開始
    const dragStartX = window3.getBoundingClientRect().x + 5;
    const dragStartY = window3.getBoundingClientRect().y + 5;
    window3.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: dragStartX,
        clientY: dragStartY,
        button: 0,
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();
    expect(datas.isDragging()).toBe(true);

    // Act - ドラッグ中にsetWindowStateを呼び出し
    setWindowState("window3", { open: true });
    await wait();

    // Assert - ドラッグが継続される
    expect(datas.isDragging()).toBe(true);
  },
};

const WindowPreventsEventPropagationToParentDatas = {
  parentClickCount: 0,
  childClickCount: 0,
};

export const WindowPreventsEventPropagationToParent: Story = {
  render: () => {
    const datas = WindowPreventsEventPropagationToParentDatas;
    const { setWindowState, stateDispatcher } = useWindow();

    useEffect(() => {
      openWindow(setWindowState, "window1", 100, 100, 200, 200);
    }, [setWindowState]);

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
        <WindowContext dispatcher={stateDispatcher}>
          <Window windowKey="window1" title="Window 1">
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
