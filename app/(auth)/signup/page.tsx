import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { UserSignupForm } from "@/components/modules/auth/UserSignupForm";

export const runtime = "edge";
export const metadata: Metadata = {
  title: "サインアップ",
  description: "新規アカウント作成",
};

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await getCurrentUser(supabase);

  if (user) {
    redirect(`/`);
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">業務管理システム</h1>
          <p className="login-subtitle">アカウント作成</p>
        </div>
        <div className="login-body">
          <UserSignupForm />
          <div className="login-footer">
            既にアカウントをお持ちの場合は <Link href="/signin">サインイン</Link>
          </div>
        </div>
      </div>
      <div className="login-decoration">
        <div className="decoration-shape shape1"></div>
        <div className="decoration-shape shape2"></div>
        <div className="decoration-shape shape3"></div>
      </div>
    </div>
  );
}
