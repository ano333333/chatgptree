import type { WindowState } from "@/components/window/types";

export function getWindowStateLogic(
  key: string,
  windowStates: Record<string, WindowState>,
  zIndexMin: number,
  defaultWindowPosition: { x: number; y: number },
  defaultWindowSize: { width: number; height: number },
) {
  return (
    windowStates[key] ?? {
      open: false,
      zIndex: zIndexMin,
      isFocused: false,
      position: { ...defaultWindowPosition },
      size: { ...defaultWindowSize },
    }
  );
}
