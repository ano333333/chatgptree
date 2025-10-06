import type { ReactNode } from "react";
import { useState } from "react";
import {
  submenuStateContext,
  submenuStateSetterContext,
} from "../contexts/submenu-context";

export function SubmenuStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"open" | "closed">("closed");

  return (
    <submenuStateContext.Provider value={{ state }}>
      <submenuStateSetterContext.Provider value={{ setState }}>
        {children}
      </submenuStateSetterContext.Provider>
    </submenuStateContext.Provider>
  );
}
