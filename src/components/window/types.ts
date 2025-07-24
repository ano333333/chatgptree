export type WindowState = {
  open: boolean;
  zIndex: number;
  isFocused: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
};

export type SetWindowStateArgsType =
  | {
      open: false;
    }
  | {
      open: true;
      position?: {
        x: number;
        y: number;
      };
      size?: {
        width: number;
        height: number;
      };
    };
