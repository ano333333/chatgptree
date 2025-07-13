import { expect } from "@storybook/test";

/**
 * 位置（x, y）の両方をtoBeCloseToで検証する関数
 * @param actual - 実際の位置
 * @param expected - 期待する位置
 */
export function expectPositionToBeCloseTo(
  actual: { x: number; y: number },
  expected: { x: number; y: number },
): void {
  expect(actual.x).toBeCloseTo(expected.x);
  expect(actual.y).toBeCloseTo(expected.y);
}

/**
 * サイズ（width, height）の両方をtoBeCloseToで検証する関数
 * @param actual - 実際のサイズ
 * @param expected - 期待するサイズ
 */
export function expectSizeToBeCloseTo(
  actual: { width: number; height: number },
  expected: { width: number; height: number },
): void {
  expect(actual.width).toBeCloseTo(expected.width);
  expect(actual.height).toBeCloseTo(expected.height);
}
