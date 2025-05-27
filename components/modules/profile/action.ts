"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { updateCurrentProfile } from "@/lib/db/profile";
import { createClient } from "@/lib/supabase/server";

import { ProfileFormValues } from "./type";

export async function updateProfile({
  fullName,
  username,
  website,
}: ProfileFormValues) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    await updateCurrentProfile(supabase, {
      fullName,
      username,
      website,
    });

    revalidatePath("/profile");
  } catch (error) {
    throw error;
  }
}
