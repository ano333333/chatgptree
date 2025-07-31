import { createContext } from "react";

export const contextMenuContext = createContext<{
  /**
   * ContextMenuが自身を開くことを通達する。
   * ContextMenuContextは、既に開いているコンテキストメニューを閉じる。
   * @param id 新しいContextMenuのID
   * @param close 新しいContextMenuを閉じるための関数
   */
  openCurrentContextMenu: (id: string, close: () => void) => void;
  /**
   * 既に開いているContextMenuを閉じる。
   */
  closeCurrentContextMenu: () => void;
}>({
  openCurrentContextMenu: () => {
    throw new Error("ContextMenuContext is not initialized");
  },
  closeCurrentContextMenu: () => {
    throw new Error("ContextMenuContext is not initialized");
  },
});
