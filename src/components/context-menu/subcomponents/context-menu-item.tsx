import type { ReactNode, RefObject, MouseEvent, KeyboardEvent } from "react";

interface ContextMenuItemProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
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
