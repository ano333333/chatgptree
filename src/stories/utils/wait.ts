/**
 * テスト用の待機ユーティリティ関数
 */

/**
 * 5tickだけ描画更新を待つ関数
 * @returns Promise<void>
 */
export const wait = async () => {
  for (let i = 0; i < 5; i++) {
    await waitFor1Tick();
  }
};

const waitFor1Tick = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 0);
  });
};
