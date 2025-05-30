"use client";

import React from "react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/Button";

export default function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="post">
      <Button size="sm" variant="ghost" className="w-full justify-start">
        <LogOut className="mr-2 size-5 text-secondary" />
        <span>ログアウト</span>
      </Button>
    </form>
  );
}
