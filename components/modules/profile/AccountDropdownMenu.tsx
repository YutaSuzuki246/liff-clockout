"use client";

import React from "react";
import Link from "next/link";
import { Loader, User, LogOut } from "lucide-react";

import { getCurrentProfile } from "@/lib/db/profile";
import { useProfileStore } from "@/lib/stores/profile";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";
import { Button, buttonVariants } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/common/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

import LogoutButton from "../auth/LogoutButton";

type AccountDropdownMenuProps = {
  userEmail?: string;
};

// カスタムCSS変数をスタイルタグとして追加するコンポーネント
const StyleOverrides = () => (
  <style jsx global>{`
    :root {
      --color-dark: #121438;
      --color-primary: #6979F8;
      --color-secondary: #BE52F2;
      --color-accent-1: #00C6FF;
      --color-accent-2: #FF5EDF;
      --color-light: #F7F8FC;
    }

    .glass-effect {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
    }

    .dark .glass-effect {
      background: rgba(18, 20, 56, 0.5);
      border: 1px solid rgba(105, 121, 248, 0.18);
    }

    .custom-dropdown-content {
      border-radius: 16px !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
      border: none !important;
      overflow: hidden;
    }

    .dark .custom-dropdown-content {
      background-color: var(--color-dark) !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
    }

    .custom-menu-item {
      border-radius: 8px;
      margin: 4px 8px;
      transition: all 0.2s ease;
    }

    .custom-menu-item:hover {
      background-color: rgba(105, 121, 248, 0.1);
    }

    .dark .custom-menu-item:hover {
      background-color: rgba(105, 121, 248, 0.2);
    }

    .profile-button {
      border-radius: 12px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: white;
      border: none;
      padding: 10px 20px;
      height: auto;
      transition: all 0.3s ease;
    }

    .profile-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(105, 121, 248, 0.2);
    }

    .dark .profile-button {
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
    }
  `}</style>
);

export const AccountDropdownMenu = ({
  userEmail,
}: AccountDropdownMenuProps) => {
  const supabase = createClient();
  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const { profile, setProfile } = useProfileStore((state) => state);

  React.useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const profile = await getCurrentProfile(supabase);
      setIsLoading(false);
      if (!profile) {
        return;
      }
      setProfile(profile);
    };
    fetchProfile();
  }, [setProfile, supabase]);

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        <StyleOverrides />
        <Button className="profile-button">
          <div className="flex items-center space-x-4">
            <div className="border-2 border-white h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center">
              <Loader className="animate-spin" size={18} />
            </div>
            <div className="text-left">
              <div className="h-4 w-24 bg-white/30 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-16 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </Button>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <StyleOverrides />
        <Link
          href="/signin"
          className="profile-button flex items-center space-x-4 py-2"
        >
          <div className="border-2 border-white h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center">
            <User size={18} />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium leading-tight">サインイン</p>
            <p className="text-xs opacity-90 leading-tight">アカウント</p>
          </div>
        </Link>
      </>
    );
  }

  const { username, avatar_url } = profile;
  const nameLabel = username || userEmail || "";

  return (
    <>
      <StyleOverrides />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="profile-button">
            <div className="flex items-center space-x-4">
              <UserAvatar
                username={username}
                avatarUrl={avatar_url}
                email={userEmail}
                className="border-2 border-white h-9 w-9 flex-shrink-0"
              />
              <div className="text-left">
                <p className="text-sm font-medium leading-tight">{nameLabel}</p>
                <p className="text-xs opacity-90 leading-tight">管理者</p>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 custom-dropdown-content glass-effect">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="custom-menu-item">
              <Link href="/profile" className="flex items-center py-2">
                <User className="mr-2 size-5 text-primary" />
                <span>プロフィール</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="custom-menu-item">
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
