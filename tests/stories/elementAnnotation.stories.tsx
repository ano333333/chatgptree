import type { Meta, StoryObj } from "@storybook/react-vite";

import { ElementAnnotation } from "../../src/components/elementAnnotation";
import { useRef, useState } from "react";

const meta: Meta<typeof ElementAnnotation> = {
  title: "Components/ElementAnnotation",
  component: ElementAnnotation,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的な表示ストーリー
export const Display: Story = {
  render: () => {
    const [button, setButton] = useState<HTMLButtonElement | null>(null);
    const buttonCallbackRef = (e: HTMLButtonElement | null) => {
      setButton(e);
    };
    return (
      <>
        <button ref={buttonCallbackRef} type="button">
          click me!
        </button>
        <ElementAnnotation
          objectRef={button}
          toggleBtnPosDiff={{ x: 100, y: 0 }}
          text="1"
        >
          <h1 className="text-lg font-bold underline">description</h1>
          <p className="text-sm">ここに説明を書きます</p>
        </ElementAnnotation>
      </>
    );
  },
};

// ボタンクリックで非表示になるストーリー
export const DisplayWithHide: Story = {
  render: () => {
    const [button, setButton] = useState<HTMLButtonElement | null>(null);
    const buttonCallbackRef = (e: HTMLButtonElement | null) => {
      setButton(e);
    };
    return (
      <>
        <button
          ref={buttonCallbackRef}
          type="button"
          onClick={() => {
            if (button) {
              button.style.display = "none";
            }
          }}
        >
          click me!
        </button>
        <ElementAnnotation
          objectRef={button}
          toggleBtnPosDiff={{ x: -70, y: 0 }}
          text="1"
        />
      </>
    );
  },
};

export const DisplayWithSwap: Story = {
  render: () => {
    const [button, setButton] = useState<HTMLButtonElement | null>(null);
    const button1Ref = useRef<HTMLButtonElement | null>(null);
    const button2Ref = useRef<HTMLButtonElement | null>(null);
    const onClick = (b: HTMLButtonElement | null) => {
      setButton(b);
    };
    return (
      <>
        <div className="flex gap-2">
          <button
            ref={button1Ref}
            type="button"
            onClick={() => onClick(button1Ref.current)}
          >
            click me!
          </button>
          <button
            ref={button2Ref}
            type="button"
            onClick={() => onClick(button2Ref.current)}
          >
            click me!
          </button>
        </div>
        <ElementAnnotation
          objectRef={button}
          toggleBtnPosDiff={{ x: 0, y: -50 }}
          text="1"
        />
      </>
    );
  },
};
