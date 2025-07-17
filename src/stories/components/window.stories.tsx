import { Window, WindowContext } from "@/components/window";
import useWindow from "@/hooks/use-window";
import type { Meta, StoryObj } from "@storybook/react-vite";
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

export const Default: Story = {
  render: () => {
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();
    const toggleButtonOnClick = (
      key: string,
      position: { x: number; y: number },
    ) => {
      const windowState = getWindowState(key);
      if (windowState.open) {
        setWindowState(key, {
          open: false,
        });
      } else {
        setWindowState(key, {
          open: true,
          position,
        });
      }
    };
    const toggleButtonMessage = (key: string) => {
      const windowState = getWindowState(key);
      return `${windowState.open ? "Close" : "Open"} ${key}`;
    };
    const reopenButtonOnClick = (key: string) => {
      setWindowState(key, {
        open: true,
      });
    };
    const windowPosition: Record<string, { x: number; y: number }> = {
      window1: { x: 100, y: 100 },
      window2: { x: 150, y: 150 },
      window3: { x: 200, y: 200 },
      window4: { x: 250, y: 250 },
    };
    const windowKeys = [1, 2, 3, 4].map((i) => `window${i}`);
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
                disabled={!getWindowState(key).open}
              />
            ))}
          </div>
        </div>
        <WindowContext
          dispatcher={stateDispatcher}
          z-index-min={1}
          z-index-max={3}
          default-window-size={{ width: 300, height: 200 }}
        >
          <Window windowKey="window1" title="Window 1" />
          <Window windowKey="window2" title="Window 2" />
          <Window windowKey="window3" title="Window 3" />
          <Window windowKey="window4" title="Window 4" />
        </WindowContext>
      </div>
    );
  },
};
