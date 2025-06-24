import { useRef, useState, type FC, type ReactNode } from "react";
import { Info } from "lucide-react";

interface ElementAnnotationProps {
  className?: string;
  objectRef: Element | null;
  toggleBtnPosDiff: {
    x: number;
    y: number;
  };
  text: string;
  children?: ReactNode;
}

/**
 * 要素に注釈を表示するコンポーネント
 * 長文を表示せずIDを示すのみに止め、より詳細な説明はstorybook等で別途表示する。
 *
 * @param props.className - コンテナのclassName
 * @param props.objectRef - 注釈を表示する対象のDOM要素
 * @param props.toggleBtnPosDiff - アノテーションの左上座標 - 要素左上座標（x, y座標）
 * @param props.text - 注釈に表示するテキスト
 * @param props.children - 注釈に表示する子要素
 *
 * @example
 * ```tsx
 * const [button, setButton] = useState<HTMLButtonElement | null>(null);
 * return (
 * <>
 *   <button ref={setButton} type="button">click me!</button>
 *   <ElementAnnotation
 *     objectRef={button}
 *     toggleBtnPosDiff={{ x: -70, y: 0 }}
 *     text="example"
 *   />
 * </>
 * ```
 */
export const ElementAnnotation: FC<ElementAnnotationProps> = (props) => {
  const [toggleButtonPos, setToggleButtonPos] = useState({ x: 0, y: 0 });
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const calcToggleButtonCenter = () => {
    const rect = props.objectRef?.getBoundingClientRect();
    return rect
      ? {
          x: rect.left + props.toggleBtnPosDiff.x,
          y: rect.top + props.toggleBtnPosDiff.y,
        }
      : { x: 0, y: 0 };
  };

  // objectRefのobserverを保存する
  const observer = useRef<IntersectionObserver | null>(null);
  // observerは、監視対象が変更されたら更新する
  const prevObjectRef = useRef<Element | null>(null);
  if (prevObjectRef.current !== props.objectRef) {
    if (observer.current) {
      observer.current.disconnect();
    }
    if (props.objectRef) {
      observer.current = new IntersectionObserver(
        () => {
          setToggleButtonPos(calcToggleButtonCenter());
        },
        {
          root: null,
          threshold: 0,
        },
      );
      observer.current.observe(props.objectRef);
    }
    setToggleButtonPos(calcToggleButtonCenter());
    prevObjectRef.current = props.objectRef;
  }

  const onToggleButtonClick = () => {
    if (props.children) {
      setIsDescriptionVisible(!isDescriptionVisible);
    }
  };

  const calcToggleButtonContainerClassname = () => {
    const classNames = [
      "fixed",
      "z-10",
      "bg-white",
      "rounded-md",
      "p-2",
      "flex",
      "items-center",
      "gap-2",
      "border-gray-300",
      "border",
      "shadow-md",
    ];
    if (!props.objectRef) {
      classNames.push("hidden");
    }
    return classNames.join(" ");
  };
  const calcDescriptionContainerClassname = () => {
    const classNames = [
      "fixed",
      "z-10",
      "bg-white",
      "rounded-md",
      "p-2",
      "border-gray-300",
      "border",
      "shadow-md",
    ];
    if (!props.objectRef) {
      classNames.push("hidden");
    }
    return classNames.join(" ");
  };

  const calcToggleButtonClassname = () => {
    const classNames = ["stroke-blue-400", "inline"];
    return classNames.join(" ");
  };

  return (
    <>
      {isDescriptionVisible ? (
        <div
          className={`${calcDescriptionContainerClassname()} ${props.className}`}
          style={{
            left: `${Math.floor(toggleButtonPos.x)}px`,
            top: `${Math.floor(toggleButtonPos.y)}px`,
          }}
        >
          <Info
            className={calcToggleButtonClassname()}
            onClick={onToggleButtonClick}
          />
          <div>{props.children}</div>
        </div>
      ) : (
        <div
          className={`${calcToggleButtonContainerClassname()} ${props.className}`}
          style={{
            left: `${Math.floor(toggleButtonPos.x)}px`,
            top: `${Math.floor(toggleButtonPos.y)}px`,
          }}
        >
          <Info
            className={calcToggleButtonClassname()}
            onClick={onToggleButtonClick}
          />
          <p className="text-sm">{props.text}</p>
        </div>
      )}
    </>
  );
};
