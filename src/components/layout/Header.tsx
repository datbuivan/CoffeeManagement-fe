import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  onSidebarToggle: () => void;
  title: string;
}

export default function Header({ onSidebarToggle, title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] px-6">
      <Button
        variant="ghost"
        className="md:hidden"
        onClick={onSidebarToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-4">
       <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="/user-avatar.jpg" />
              <AvatarFallback>NV</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
            <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}