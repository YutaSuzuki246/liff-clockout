import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { UserAuthForm } from "@/components/modules/auth/UserAuthForm";

export const metadata: Metadata = {
  title: "サインイン",
  description: "アカウントにサインイン",
};

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function LoginPage() {
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
          <p className="login-subtitle">業務管理ダッシュボード</p>
        </div>
        <div className="login-body">
          <UserAuthForm />
          <div className="login-footer">
            アカウントをお持ちでない場合は <Link href="/signup">サインアップ</Link>
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
