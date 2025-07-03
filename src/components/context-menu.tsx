import { ChevronRight } from "lucide-react";
import {
  createContext,
  useContext,
  useState,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
  type RefObject,
} from "react";

interface ContextMenuProps {
  screenPosition: {
    x: number;
    y: number;
  };
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
}

/**
 * コンテキストメニューのルート要素
 * @param props.screenPosition コンテキストメニューのスクリーン座標位置
 * @param props.children (ContextMenuItem|ContextMenuSeparator|ContextMenuSubMenuRoot)[]
 */
export function ContextMenu(props: ContextMenuProps) {
  return (
    <div
      className={`fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px] z-[2000] ${props.className ?? ""}`}
      style={{
        top: props.screenPosition.y,
        left: props.screenPosition.x,
      }}
      ref={props.ref}
      data-component-name="context-menu"
      role="menu"
    >
      {props.children}
    </div>
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
