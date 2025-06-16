import React from "react";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import AlertTest from "../src/components/alertTest";

/**
 * Reactのテストを含むため、ブラウザモード(**.browser.test.ts)で実行する
 */
test("Browser Mode & React Template", async () => {
  const array = [1, 2, 3];
  const alertType = () =>
    array.every((v) => v > 0) ? ("success" as const) : ("error" as const);
  const message = () => `there are ${array.length} elements`; // テスト用にメッセージを生成
  const props = () => {
    return {
      type: alertType(),
      message: message(),
    };
  };

  // 1回目の要素描画
  const screen = render(<AlertTest {...props()} />);
  await expect.element(screen.getByText("✓")).toBeVisible();

  array.push(0);

  // 描画を更新
  screen.rerender(<AlertTest {...props()} />);
  await expect.element(screen.getByText("✕")).toBeVisible();
});
