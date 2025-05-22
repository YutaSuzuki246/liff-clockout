"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

import { registerProfileSchema } from "./schema";

type UserSignupFormProps = React.HTMLAttributes<HTMLDivElement>;

type FormData = z.infer<typeof registerProfileSchema>;

export function UserSignupForm({ className, ...props }: UserSignupFormProps) {
  const supabase = createClient();
  const { replace } = useRouter();
  const { register, formState, handleSubmit } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(registerProfileSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const signUpResult = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback`,
        data: {
          full_name: data.username,
        },
      },
    });

    if (signUpResult?.error) {
      setIsLoading(false);
      return toast({
        title: "エラー",
        description: "サインアップ中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      });
    }

    replace("/");
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="email">メールアドレス</label>
        <div className="input-with-icon">
          <svg className="icon input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <input
            type="email"
            id="email"
            placeholder="example@example.com"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            {...register("email")}
          />
        </div>
        {formState.errors.email && (
          <p className="text-sm text-red-500 mt-1">{formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="username">氏名

        </label>
        <div className="input-with-icon">
          <svg className="icon input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <input
            type="text"
            id="username"
            placeholder="氏名を入力"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            {...register("username")}
          />
        </div>
        {formState.errors.username && (
          <p className="text-sm text-red-500 mt-1">{formState.errors.username.message}</p>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">パスワード</label>
        <div className="input-with-icon">
          <svg className="icon input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="パスワードを入力"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            {...register("password")}
          />
          <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        {formState.errors.password && (
          <p className="text-sm text-red-500 mt-1">{formState.errors.password.message}</p>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword">パスワード（確認用）</label>
        <div className="input-with-icon">
          <svg className="icon input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="パスワードを再入力"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          <button type="button" className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        {formState.errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{formState.errors.confirmPassword.message}</p>
        )}
      </div>
      
      <button type="submit" className="login-btn" disabled={isLoading}>
        {isLoading && <Loader className="mr-2 size-4 animate-spin" />}
        サインアップ
      </button>
    </form>
  );
}
