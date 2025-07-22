import { Window, WindowContext, type WindowElement } from "@/components/window";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, type RefObject } from "react";
import { action } from "storybook/actions";

const meta: Meta<typeof Window> = {
  title: "Components/Window",
  component: Window,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

function WindowButton({
  message,
  onClick,
  disabled,
}: { message: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border border-gray-300 rounded-md p-2 ${
        disabled ? "bg-gray-400" : "bg-white"
      }`}
    >
      {message}
    </button>
  );
}

function WindowBody({ windowKey }: { windowKey: string }) {
  console.info(`${windowKey} re-rendered`);
  return <div>{windowKey}</div>;
}

export const Default: Story = {
  render: () => {
    console.info("Default re-rendered");
    const windowKeys = [1, 2, 3, 4].map((i) => `window${i}`);
    const windowRefs = useRef<
      Record<(typeof windowKeys)[number], RefObject<WindowElement | null>>
    >(
      windowKeys.reduce(
        (acc, key) => {
          acc[key] = useRef<WindowElement>(null);
          return acc;
        },
        {} as Record<
          (typeof windowKeys)[number],
          RefObject<WindowElement | null>
        >,
      ),
    );
    const toggleButtonOnClick = (
      key: string,
      position: { x: number; y: number },
    ) => {
      windowRefs.current[key]?.current?.setWindowState({
        open: true,
        position,
      });
    };
    const toggleButtonMessage = (key: string) => {
      return `Open ${key}`;
    };
    const reopenButtonOnClick = (key: string) => {
      windowRefs.current[key]?.current?.setWindowState({
        open: true,
      });
    };
    const windowPosition: Record<string, { x: number; y: number }> = {
      window1: { x: 100, y: 100 },
      window2: { x: 150, y: 150 },
      window3: { x: 200, y: 200 },
      window4: { x: 250, y: 250 },
    };
    return (
      <div
        className="w-[800px] h-[800px]"
        onClick={action("background")}
        onKeyDown={action("background")}
        onKeyUp={action("background")}
      >
        <div className="flex flex-col gap-2 m-2">
          <div className="flex flex-row gap-2 m-2">
            {windowKeys.map((key) => (
              <WindowButton
                key={key}
                message={toggleButtonMessage(key)}
                onClick={() => toggleButtonOnClick(key, windowPosition[key])}
                disabled={false}
              />
            ))}
          </div>
          <div className="flex flex-row gap-2 m-2">
            {windowKeys.map((key) => (
              <WindowButton
                key={key}
                message={`reopen ${key}`}
                onClick={() => reopenButtonOnClick(key)}
                disabled={false}
              />
            ))}
          </div>
        </div>
        <WindowContext
          z-index-min={1}
          z-index-max={3}
          default-window-size={{ width: 300, height: 200 }}
        >
          {windowKeys.map((key: (typeof windowKeys)[number]) => (
            <Window
              key={key}
              windowKey={key}
              title={`Window ${key}`}
              ref={windowRefs.current[key]}
            >
              <WindowBody windowKey={key} />
            </Window>
          ))}
        </WindowContext>
      </div>
    );
  },
};
