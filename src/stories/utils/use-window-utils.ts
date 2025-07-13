import type useWindow from "@/hooks/use-window";

/**
 * useWindowから返されるsetWindowState関数のtype alias
 */
export type SetWindowStateType = ReturnType<typeof useWindow>["setWindowState"];

/**
 * useWindowから返されるgetWindowState関数のtype alias
 */
export type GetWindowStateType = ReturnType<typeof useWindow>["getWindowState"];
