import { createContext } from "react";

export type SubmenuState = "open" | "closed";

export const submenuStateContext = createContext<{
  state: SubmenuState;
}>({
  state: "closed",
});

export const submenuStateSetterContext = createContext<{
  setState: (state: SubmenuState) => void;
}>({
  setState: () => {
    throw new Error(
      "ContextMenuSubMenuRootの外でContextMenuSubMenuTriggerまたはContextMenuSubMenuが使用されています",
    );
  },
});
