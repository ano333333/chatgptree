export type UseWindowDispatcherType = object;

type WindowState =
  | {
      open: false;
    }
  | {
      open: true;
      position: {
        x: number;
        y: number;
      };
      size: {
        width: number;
        height: number;
      };
    };
type SetWindowStateArgsType =
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

const useWindow = (() => {
  const getWindowState: (key: string) => WindowState = () => ({
    open: false,
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
  });
  const setWindowState: (key: string, state: SetWindowStateArgsType) => void =
    () => {
      return;
    };
  const stateDispatcher: UseWindowDispatcherType = {};
  return {
    getWindowState,
    setWindowState,
    stateDispatcher,
  };
}) as (initialState?: SetWindowStateArgsType) => {
  getWindowState: (key: string) => WindowState;
  setWindowState: (key: string, state: SetWindowStateArgsType) => void;
  stateDispatcher: UseWindowDispatcherType;
};

export default useWindow;
