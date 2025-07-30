import { ChevronRight } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
  type RefObject,
  type MouseEvent,
  type KeyboardEvent,
  useId,
} from "react";

interface ContextMenuContextProps {
  children: ReactNode;
}

const contextMenuContext = createContext<{
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

type ContextMenuState =
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

interface ContextMenuProps {
  ref?: RefObject<ContextMenuElement | null>;
  initialPosition?: {
    x: number;
    y: number;
  };
  children?: ReactNode;
  className?: string;
}

/**
 * コンテキストメニューのルート要素
 * @param props.screenPosition コンテキストメニューのスクリーン座標位置
 * @param props.children (ContextMenuItem|ContextMenuSeparator|ContextMenuSubMenuRoot)[]
 */
export function ContextMenu({
  ref,
  initialPosition,
  children,
  className,
}: ContextMenuProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );

  // contextMenuContextから識別するためのID
  const contextMenuId = useId();

  const { openCurrentContextMenu, closeCurrentContextMenu } = useRef(
    useContext(contextMenuContext),
  ).current;

  useImperativeHandle(ref, () => ({
    style: divRef.current?.style,
    className: divRef.current?.className,
    setContextMenuState: (state: ContextMenuState) => {
      if (state.status === "open") {
        setPosition(state.position);
        openCurrentContextMenu(contextMenuId, () => {
          setPosition(null);
        });
      } else {
        setPosition(null);
        closeCurrentContextMenu();
      }
    },
  }));

  const initialPositionRef = useRef(initialPosition);
  useEffect(() => {
    if (initialPositionRef.current) {
      setPosition(initialPositionRef.current);
      openCurrentContextMenu(contextMenuId, () => {
        setPosition(null);
      });
    }
    return () => {
      setPosition(null);
      closeCurrentContextMenu();
    };
  }, [openCurrentContextMenu, closeCurrentContextMenu, contextMenuId]);

  const style = useMemo(() => {
    return {
      top: position?.y,
      left: position?.x,
      zIndex: 1 << 20,
    };
  }, [position]);

  // コンテキストメニューの子要素から漏れたイベントを停止(documentまで届くとContextMenuContextにより自分が閉じられる)
  const handleContextMenuClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleContextMenuContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleContextMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      {position && (
        <div
          className={`fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px] z-[2000] ${className ?? ""}`}
          style={style}
          ref={divRef}
          data-component-name="context-menu"
          role="menu"
          onClick={handleContextMenuClick}
          onContextMenu={handleContextMenuContextMenu}
          onKeyDown={handleContextMenuKeyDown}
        >
          {children}
        </div>
      )}
    </>
  );
}

interface ContextMenuItemProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  ref?: RefObject<HTMLButtonElement>;
  children?: ReactNode;
  className?: string;
}

/**
 * コンテキストメニュー/サブメニューの項目を表す要素
 * @param props.onClick クリック時のハンドラ
 * @param props.onKeyDown キー押下時のハンドラ
 * @param props.children string
 */
export function ContextMenuItem(props: ContextMenuItemProps) {
  return (
    <button
      className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer w-full text-left ${props.className ?? ""}`}
      ref={props.ref}
      data-component-name="context-menu-item"
      type="button"
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      role="menuitem"
    >
      {props.children}
    </button>
  );
}

/**
 * コンテキストメニュー/サブメニューの区切り線を表す要素
 */
export function ContextMenuSeparator() {
  return (
    <div
      className="border-t border-gray-200"
      data-component-name="context-menu-separator"
    />
  );
}

type SubmenuState = "open" | "closed";

const submenuStateContext = createContext<{
  state: SubmenuState;
}>({
  state: "closed",
});

const submenuStateSetterContext = createContext<{
  setState: (state: SubmenuState) => void;
}>({
  setState: () => {
    throw new Error(
      "ContextMenuSubMenuRootの外でContextMenuSubMenuTriggerまたはContextMenuSubMenuが使用されています",
    );
  },
});

interface ContextMenuSubMenuRootProps {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
}

/**
 * サブメニューのルート要素
 * @param props.children (ContextMenuSubMenuTrigger|ContextMenuSubMenu)[]
 * @example
 * ```tsx
 * <ContextMenu>
 * <ContextMenuSubMenuRoot>
 *   <ContextMenuSubMenuTrigger>submenu open trigger item</ContextMenuSubMenuTrigger>
 *   <ContextMenuSubMenu>
 *     <ContextMenuItem>submenu item 1</ContextMenuItem>
 *     <ContextMenuItem>submenu item 2</ContextMenuItem>
 *   </ContextMenuSubMenu>
 * </ContextMenuSubMenuRoot>
 * </ContextMenu>
 * ```
 */
export function ContextMenuSubMenuRoot(props: ContextMenuSubMenuRootProps) {
  const [state, setState] = useState<SubmenuState>("closed");

  return (
    <submenuStateContext.Provider value={{ state }}>
      <submenuStateSetterContext.Provider value={{ setState }}>
        <div className="relative">{props.children}</div>
      </submenuStateSetterContext.Provider>
    </submenuStateContext.Provider>
  );
}

interface ContextMenuSubMenuProps {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
}

/**
 * 親メニューの右に表示するサブメニューのアイテムのコンテナ
 * @param props.children (ContextMenuItem|ContextMenuSeparator|ContextMenuSubMenuRoot)[]
 */
export function ContextMenuSubMenu(props: ContextMenuSubMenuProps) {
  const submenuState = useContext(submenuStateContext);
  const submenuStateSetter = useContext(submenuStateSetterContext);

  const onMouseEnter = () => {
    submenuStateSetter.setState("open");
  };
  const onMouseLeave = () => {
    submenuStateSetter.setState("closed");
  };

  return (
    submenuState.state === "open" && (
      <div
        className={`absolute top-0 left-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px] z-[2000] ${props.className ?? ""}`}
        ref={props.ref}
        data-component-name="context-menu-sub-menu"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label="context-menu-sub-menu"
        role="menu"
      >
        {props.children}
      </div>
    )
  );
}

interface ContextMenuSubMenuTriggerProps {
  ref?: RefObject<HTMLButtonElement>;
  children?: ReactNode;
  className?: string;
}

/**
 * ホバーでサブメニューを開く、コンテキストメニューアイテム
 * @param props.children string
 */
export function ContextMenuSubMenuTrigger(
  props: ContextMenuSubMenuTriggerProps,
) {
  const submenuState = useContext(submenuStateContext);
  const submenuStateSetter = useContext(submenuStateSetterContext);

  const onMouseEnter = () => {
    submenuStateSetter.setState("open");
  };
  const onMouseLeave = () => {
    submenuStateSetter.setState("closed");
  };

  return (
    <button
      className={`px-3 py-2 text-sm ${submenuState.state === "open" ? "bg-gray-100" : ""} flex items-center cursor-pointer w-full text-left ${props.className ?? ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="menuitem"
      aria-haspopup="true"
      aria-expanded={submenuState.state === "open"}
      type="button"
      name="submenu-trigger"
    >
      {props.children}
      <ChevronRight size={14} className="inline-block text-gray-400 ml-auto" />
    </button>
  );
}
