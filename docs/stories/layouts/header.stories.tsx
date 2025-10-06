import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { action } from "storybook/actions";
import { ElementAnnotation } from "@/components/elementAnnotation";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Header from "@/layouts/header";

const useElementAnnotation = (query: string) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setElement(document.querySelector<HTMLElement>(query));
  }, [query]);

  return element;
};

const meta: Meta<typeof Header> = {
  title: "Layouts/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// サイドバーが開いた状態のストーリー
export const SidebarOpen: Story = {
  render: () => {
    const sidebarTrigger = useElementAnnotation('[data-sidebar="trigger"]');
    const headerBanner = useElementAnnotation('[aria-level="1"]');
    const headerMenu = useElementAnnotation(
      '[data-slot="dropdown-menu-trigger"]',
    );
    const headerMenuItemLoad = useElementAnnotation(
      '[role="menuitem"]:nth-child(1)',
    );
    const headerMenuItemSave = useElementAnnotation(
      '[role="menuitem"]:nth-child(2)',
    );
    const headerMenuItemSettings = useElementAnnotation(
      '[role="menuitem"]:nth-child(3)',
    );
    const headerMenuItemHelp = useElementAnnotation(
      '[role="menuitem"]:nth-child(4)',
    );

    return (
      <>
        <SidebarProvider open={true}>
          <Sidebar className="border-r" />
          <SidebarInset>
            <Header
              onClickLoad={action("onClickLoad")}
              onClickSave={action("onClickSave")}
              onClickSetting={action("onClickSetting")}
              onClickHelp={action("onClickHelp")}
            />
          </SidebarInset>
        </SidebarProvider>
        <ElementAnnotation
          objectRef={sidebarTrigger}
          toggleBtnPosDiff={{ x: 0, y: 30 }}
          text=""
        >
          サイドバートリガー(SidebarTrigger)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerBanner}
          toggleBtnPosDiff={{ x: 120, y: -5 }}
          text=""
        >
          バナー(Banner)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerMenu}
          toggleBtnPosDiff={{ x: -60, y: 0 }}
          text=""
        >
          ヘッダーメニュー(HeaderMenu)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerMenuItemLoad}
          toggleBtnPosDiff={{ x: -20, y: 0 }}
          text=""
        >
          ヘッダー読み込みボタン(HeaderMenuItemLoad)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerMenuItemSave}
          toggleBtnPosDiff={{ x: -180, y: 0 }}
          text=""
        >
          ヘッダー保存ボタン(HeaderMenuItemSave)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerMenuItemSettings}
          toggleBtnPosDiff={{ x: -180, y: 0 }}
          text=""
        >
          ヘッダー設定ボタン(HeaderMenuItemSettings)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerMenuItemHelp}
          toggleBtnPosDiff={{ x: -180, y: 0 }}
          text=""
        >
          ヘッダーヘルプボタン(HeaderMenuItemHelp)
        </ElementAnnotation>
      </>
    );
  },
};

// サイドバーが閉じた状態のストーリー
export const SidebarClosed: Story = {
  render: () => {
    const sidebarTrigger = useElementAnnotation('[data-sidebar="trigger"]');
    const headerBanner = useElementAnnotation('[class*="text-lg"]');
    const headerMenu = useElementAnnotation(
      '[data-slot="dropdown-menu-trigger"]',
    );
    const headerMenuItemLoad = useElementAnnotation(
      '[role="menuitem"]:nth-child(1)',
    );
    const headerMenuItemSave = useElementAnnotation(
      '[role="menuitem"]:nth-child(2)',
    );
    const headerMenuItemSettings = useElementAnnotation(
      '[role="menuitem"]:nth-child(3)',
    );
    const headerMenuItemHelp = useElementAnnotation(
      '[role="menuitem"]:nth-child(4)',
    );

    return (
      <>
        <SidebarProvider open={true}>
          <Sidebar className="border-r" />
          <SidebarInset>
            <Header
              onClickLoad={action("onClickLoad")}
              onClickSave={action("onClickSave")}
              onClickSetting={action("onClickSetting")}
              onClickHelp={action("onClickHelp")}
            />
          </SidebarInset>
        </SidebarProvider>
        <ElementAnnotation
          objectRef={sidebarTrigger}
          toggleBtnPosDiff={{ x: 0, y: 30 }}
          text=""
        >
          サイドバートリガー(SidebarTrigger)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerBanner}
          toggleBtnPosDiff={{ x: 120, y: -5 }}
          text=""
        >
          バナー(Banner)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerMenu}
          toggleBtnPosDiff={{ x: -60, y: 0 }}
          text=""
        >
          ヘッダーメニュー(HeaderMenu)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerMenuItemLoad}
          toggleBtnPosDiff={{ x: -20, y: 0 }}
          text=""
        >
          ヘッダー読み込みボタン(HeaderMenuItemLoad)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerMenuItemSave}
          toggleBtnPosDiff={{ x: -180, y: 0 }}
          text=""
        >
          ヘッダー保存ボタン(HeaderMenuItemSave)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerMenuItemSettings}
          toggleBtnPosDiff={{ x: -180, y: 0 }}
          text=""
        >
          ヘッダー設定ボタン(HeaderMenuItemSettings)
        </ElementAnnotation>
        <ElementAnnotation
          objectRef={headerMenuItemHelp}
          toggleBtnPosDiff={{ x: -180, y: 0 }}
          text=""
        >
          ヘッダーヘルプボタン(HeaderMenuItemHelp)
        </ElementAnnotation>
      </>
    );
  },
};
