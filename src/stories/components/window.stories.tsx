import { Window, WindowContext } from "@/components/window";
import useWindow from "@/hooks/use-window";
import type { Meta, StoryObj } from "@storybook/react-vite";

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

export const Default: Story = {
  render: () => {
    const { getWindowState, setWindowState, stateDispatcher } = useWindow();
    const buttonOnClick = (key: string, position: { x: number; y: number }) => {
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
    const buttonMessage = (key: string) => {
      const windowState = getWindowState(key);
      return `${windowState.open ? "Close" : "Open"} ${key}`;
    };
    return (
      <>
        <div className="flex flex-row gap-2 m-2">
          <button
            type="button"
            onClick={() => buttonOnClick("window1", { x: 100, y: 100 })}
            className="border border-gray-300 rounded-md p-2"
          >
            {buttonMessage("window1")}
          </button>
          <button
            type="button"
            onClick={() => buttonOnClick("window2", { x: 150, y: 150 })}
            className="border border-gray-300 rounded-md p-2"
          >
            {buttonMessage("window2")}
          </button>
          <button
            type="button"
            onClick={() => buttonOnClick("window3", { x: 200, y: 200 })}
            className="border border-gray-300 rounded-md p-2"
          >
            {buttonMessage("window3")}
          </button>
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
        </WindowContext>
      </>
    );
  },
};
