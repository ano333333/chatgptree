import {
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useId,
} from "react";
import type { MouseEvent, KeyboardEvent, ReactNode, RefObject } from "react";
import type {
  ContextMenuState,
  ContextMenuElement,
} from "./context-menu-context";
import { contextMenuContext } from "../contexts/context-menu-context";

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
