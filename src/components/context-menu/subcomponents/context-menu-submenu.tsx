import { ChevronRight } from "lucide-react";
import type { ReactNode, RefObject } from "react";
import { useContext } from "react";
import {
  submenuStateContext,
  submenuStateSetterContext,
} from "../contexts/submenu-context";
import { SubmenuStateProvider } from "./submenu-context";

interface ContextMenuSubMenuRootProps {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
}

interface ContextMenuSubMenuProps {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
}

interface ContextMenuSubMenuTriggerProps {
  ref?: RefObject<HTMLButtonElement>;
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
  return (
    <SubmenuStateProvider>
      <div className="relative">{props.children}</div>
    </SubmenuStateProvider>
  );
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
