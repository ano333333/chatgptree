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

interface HeaderProps {
  onClickLoad?: () => void;
  onClickSave?: () => void;
  onClickSetting?: () => void;
  onClickHelp?: () => void;
}

/**
 * SPAの共通ヘッダ
 *
 * @param props.onClickLoad - ヘッダー読み込みボタンクリック時のコールバック
 * @param props.onClickSave - ヘッダー保存ボタンクリック時のコールバック
 * @param props.onClickSetting - ヘッダー設定ボタンクリック時のコールバック
 * @param props.onClickHelp - ヘッダーヘルプボタンクリック時のコールバック
 */
export default function Header(props: HeaderProps) {
  const { open } = useSidebar();
  const { onClickLoad, onClickSave, onClickSetting, onClickHelp } = props;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-all duration-200">
      <div className="flex items-center gap-2">
        <SidebarTrigger
          className="mr-2"
          aria-label={`サイドバーを${open ? "閉じる" : "開く"}`}
        >
          <PanelLeft className="size-4" />
          <span className="sr-only">
            サイドバーを{open ? "閉じる" : "開く"}
          </span>
        </SidebarTrigger>
        <span className="text-lg font-semibold">ChatGPTree</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button
            variant="ghost"
            size="icon"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Menu className="size-4" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onClickLoad} role="menuitem">
            読み込み
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClickSave} role="menuitem">
            保存
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onClickSetting} role="menuitem">
            設定
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClickHelp} role="menuitem">
            ヘルプ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
