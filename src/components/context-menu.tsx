import type {
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
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
    >
      {props.children}
    </div>
  );
}

interface ContextMenuItemProps {
  children?: ReactNode;
  className?: string;
  ref?: RefObject<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
}

export function ContextMenuItem(props: ContextMenuItemProps) {
  return (
    <button
      className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer w-full text-left ${props.className ?? ""}`}
      ref={props.ref}
      data-component-name="context-menu-item"
      type="button"
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
    >
      {props.children}
    </button>
  );
}

export function ContextMenuSeparator() {
  return (
    <div
      className="border-t border-gray-200"
      data-component-name="context-menu-separator"
    />
  );
}
