"use client";

import React, { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

import { AccountDropdownMenu } from "../../modules/profile/AccountDropdownMenu";
import { ThemeToggle } from "../../theme/ThemeToggle";
import { buttonVariants } from "../../ui/Button";

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const supabase = createClient();

  // マウント後にのみレンダリングを行い、ハイドレーションエラーを防止
  useEffect(() => {
    setIsMounted(true);
    
    // ユーザー情報を取得
    const getUserEmail = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email);
      }
    };
    
    getUserEmail();
  }, [supabase]);

  return (
    <header className="header">
      <div className="flex items-center">
        <h1 className="header-title">ダッシュボード</h1>
      </div>
      
      <div className="header-actions">
        <div className="flex items-center">
            <AccountDropdownMenu userEmail={userEmail} />
        </div>
      </div>
    </header>
  );
}
