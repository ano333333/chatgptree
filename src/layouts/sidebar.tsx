import { MessageSquarePlus } from "lucide-react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { type KeyboardEvent, useState } from "react";

interface SidebarProps {
  chatTitles: string[];
  selectedChatIndex: number;
  onClickNewChat?: () => void;
  onClickChat?: (index: number) => void;
}

/**
 * サイドメニュー
 * @param props.chatTitles - サイドバーチャットの配列
 * @param props.selectedChatIndex - 選択中のサイドバーチャットのインデックス(0-indexed)
 * @param props.onClickNewChat - サイドバーチャット作成ボタンをクリックしたときのコールバック
 * @param props.onClickChat - サイドバーチャットの1つをクリックしたときのコールバック
 */
export function Sidebar(props: SidebarProps) {
  const { chatTitles, selectedChatIndex, onClickNewChat, onClickChat } = props;
  const [selectedChatIndexState, setSelectedChatIndexState] =
    useState(selectedChatIndex);

  const onKeyDownSidemenuBarItem = (e: KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      setSelectedChatIndexState(index);
      onClickChat?.(index);
    }
  };

  return (
    <SidebarComponent className="border-r" collapsible="offcanvas">
      <SidebarHeader className="p-4 bg-gray-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="w-full justify-start"
              onClick={onClickNewChat}
            >
              <MessageSquarePlus className="size-4" />
              <p>新しいチャット</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      <SidebarContent className="px-4 pt-4 bg-gray-50">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatTitles.map((chatTitle, index) => (
                <SidebarMenuItem
                  key={chatTitle}
                  onClick={() => {
                    setSelectedChatIndexState(index);
                    onClickChat?.(index);
                  }}
                  onKeyDown={(e) => onKeyDownSidemenuBarItem(e, index)}
                  tabIndex={0}
                >
                  <SidebarMenuButton
                    asChild={true}
                    className="w-full justify-start"
                    isActive={index === selectedChatIndexState}
                  >
                    <p>{chatTitle}</p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </SidebarComponent>
  );
}
