import * as z from "zod";

const credentialAuthObject = {
  email: z.string().email("有効なメールアドレスを入力してください。"),
  password: z.string().min(6, "パスワードは最低6文字以上で入力してください。"),
};

export const credentialAuthSchema = z.object({
  ...credentialAuthObject,
});

export const registerProfileSchema = z
  .object({
    ...credentialAuthObject,
    username: z.string().optional(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });
