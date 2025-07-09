import type { ReactNode } from "react";
import type { UseWindowDispatcherType } from "@/hooks/use-window";

interface WindowProps {
  key: string; // 各ウィンドウに対し一意のstring
  title?: string;
  children?: ReactNode;
}
export function Window({ key, title, children }: WindowProps) {
  return (
    <div key={key}>
      <div>{title}</div>
      {children}
    </div>
  );
}

interface WindowContextProps {
  dispatcher: UseWindowDispatcherType;
  "z-index-min"?: number;
  "z-index-max"?: number;
  "default-window-position"?: {
    x: number;
    y: number;
  };
  "default-window-size"?: {
    width: number;
    height: number;
  };
  "width-min"?: number;
  "height-min"?: number;
  children?: ReactNode;
}

export function WindowContext({ children }: WindowContextProps) {
  return <>{children}</>;
}
