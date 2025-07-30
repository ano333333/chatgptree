import { useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { contextMenuContext } from "../contexts/context-menu-context";

interface ContextMenuContextProps {
  children: ReactNode;
}

export type ContextMenuState =
  | {
      status: "open";
      position: {
        x: number;
        y: number;
      };
    }
  | {
      status: "close";
    };

export type ContextMenuElement = {
  style: CSSStyleDeclaration | undefined;
  className: string | undefined;
  setContextMenuState: (state: ContextMenuState) => void;
};

export function ContextMenuContext(props: ContextMenuContextProps) {
  const currentContextMenu = useRef<{
    id: string;
    close: () => void;
  } | null>(null);

  const openCurrentContextMenu = useCallback(
    (id: string, close: () => void) => {
      const current = currentContextMenu.current;
      if (current && current.id !== id) {
        current.close();
      }
      currentContextMenu.current = { id, close };
    },
    [],
  );
  const closeCurrentContextMenu = useCallback(() => {
    if (currentContextMenu.current) {
      currentContextMenu.current.close();
      currentContextMenu.current = null;
    }
  }, []);

  /**
   * documentのイベントを監視して、コンテキストメニュー外で
   * - click
   * - contextmenu
   * - keydown
   * のイベントが生じれば、コンテキストメニューを閉じる
   */
  useEffect(() => {
    const handleDocumentClick = () => {
      closeCurrentContextMenu();
    };

    const handleDocumentContextMenu = () => {
      closeCurrentContextMenu();
    };

    const handleDocumentKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCurrentContextMenu();
      }
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("contextmenu", handleDocumentContextMenu);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("contextmenu", handleDocumentContextMenu);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [closeCurrentContextMenu]);

  return (
    <contextMenuContext.Provider
      value={{
        openCurrentContextMenu,
        closeCurrentContextMenu,
      }}
    >
      {props.children}
    </contextMenuContext.Provider>
  );
}
