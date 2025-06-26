import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, PanelLeft } from "lucide-react";

/**
 * SPAの共通ヘッダ
 */
export default function Header() {
  const { open } = useSidebar();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-all duration-200">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mr-2">
          <PanelLeft className="size-4" />
          <span className="sr-only">
            サイドバーを{open ? "閉じる" : "開く"}
          </span>
        </SidebarTrigger>
        <span className="text-lg font-semibold">ChatGPTree</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button variant="ghost" size="icon">
            <Menu className="size-4" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>読み込み</DropdownMenuItem>
          <DropdownMenuItem>保存</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>設定</DropdownMenuItem>
          <DropdownMenuItem>ヘルプ</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
