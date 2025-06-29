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
import type { KeyboardEvent } from "react";

interface SidebarProps {
  chats: {
    id: string;
    title: string;
  }[];
  selectedChatId: string;
  onClickNewChat?: () => void;
  onClickChat?: (id: string) => void;
}

/**
 * サイドメニュー
 * @param props.chats - サイドバーチャットの配列
 * @param props.chats[].id - サイドバーチャットのid。idは一意であること
 * @param props.chats[].title - サイドバーチャットのタイトル
 * @param props.selectedChatId - 選択中のサイドバーチャットのid
 * @param props.onClickNewChat - サイドバーチャット作成ボタンをクリックしたときのコールバック
 * @param props.onClickChat - サイドバーチャットの1つをクリックしたときのコールバック
 */
export function Sidebar(props: SidebarProps) {
  const { chats, selectedChatId, onClickNewChat, onClickChat } = props;

  const onClickSidemenuBarItem = (id: string) => {
    onClickChat?.(id);
  };

  const onKeyDownSidemenuBarItem = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      onClickChat?.(id);
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
              {chats.map((chat) => (
                <SidebarMenuItem
                  key={chat.id}
                  onClick={() => onClickSidemenuBarItem(chat.id)}
                  onKeyDown={(e) => onKeyDownSidemenuBarItem(e, chat.id)}
                  tabIndex={0}
                >
                  <SidebarMenuButton
                    asChild={true}
                    className="w-full justify-start"
                    isActive={chat.id === selectedChatId}
                  >
                    <p>{chat.title}</p>
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
