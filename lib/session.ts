import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "./types";

export const getCurrentUser = async (supabase: SupabaseClient<Database>) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};
