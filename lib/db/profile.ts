/**
 * プロファイルテーブル用のCRUD操作
 * 
 * このファイルには、profilesテーブルに対する全てのデータベース操作が含まれています。
 * 
 * 使用例:
 * ```typescript
 * import { getCurrentProfile, updateCurrentProfile } from '@/lib/db/profile';
 * 
 * // 現在のユーザーのプロファイルを取得
 * const profile = await getCurrentProfile(supabase);
 * 
 * // プロファイルを更新
 * await updateCurrentProfile(supabase, {
 *   fullName: "新しい名前",
 *   username: "new_username"
 * });
 * ```
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { Logger } from "next-axiom";
import { LogLevel } from "next-axiom/dist/logger";

import { Database, Tables, TablesInsert, TablesUpdate } from ".";
import { getCurrentUser } from "../session";

const log = new Logger({
  logLevel: LogLevel.debug,
  args: {
    route: "[DB] Profile",
  },
});

// 型定義
export type Profile = Tables<"profiles">;
export type ProfileInsert = TablesInsert<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;

// プロファイル作成用の型（フォーム用）
export interface ProfileFormData {
  fullName?: string;
  username?: string;
  website?: string;
  avatarUrl?: string;
}

/**
 * 現在のユーザーのプロファイルを取得
 */
export const getCurrentProfile = async (supabase: SupabaseClient<Database>) => {
  log.info(`${getCurrentProfile.name} called`);

  const user = await getCurrentUser(supabase);

  if (!user) return null;

  const { data, error, status } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", user.id)
    .single();

  if (error && status !== 406) {
    log.error(getCurrentProfile.name, { error, status });
    return null;
  }

  log.info(`${getCurrentProfile.name} fetched successfully`, { data });

  return data;
};

/**
 * IDでプロファイルを取得
 */
export const getProfileById = async (
  supabase: SupabaseClient<Database>,
  profileId: string
): Promise<Profile | null> => {
  log.info(`${getProfileById.name} called`, { profileId });

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (error) {
    log.error(getProfileById.name, { error, profileId });
    return null;
  }

  log.info(`${getProfileById.name} fetched successfully`, { data });
  return data;
};

/**
 * ユーザーネームでプロファイルを取得
 */
export const getProfileByUsername = async (
  supabase: SupabaseClient<Database>,
  username: string
): Promise<Profile | null> => {
  log.info(`${getProfileByUsername.name} called`, { username });

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    log.error(getProfileByUsername.name, { error, username });
    return null;
  }

  log.info(`${getProfileByUsername.name} fetched successfully`, { data });
  return data;
};

/**
 * 複数のプロファイルを取得
 */
export const getProfiles = async (
  supabase: SupabaseClient<Database>,
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: keyof Profile;
    ascending?: boolean;
  }
): Promise<Profile[]> => {
  log.info(`${getProfiles.name} called`, { options });

  let query = supabase.from("profiles").select("*");

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? true });
  }

  const { data, error } = await query;

  if (error) {
    log.error(getProfiles.name, { error, options });
    return [];
  }

  log.info(`${getProfiles.name} fetched successfully`, { count: data?.length });
  return data || [];
};

/**
 * プロファイルを作成
 */
export const createProfile = async (
  supabase: SupabaseClient<Database>,
  profileData: ProfileInsert
): Promise<Profile | null> => {
  log.info(`${createProfile.name} called`, { profileData });

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    log.error(createProfile.name, { error, profileData });
    throw new Error(`プロファイルの作成に失敗しました: ${error.message}`);
  }

  log.info(`${createProfile.name} created successfully`, { data });
  return data;
};

/**
 * プロファイルを更新
 */
export const updateProfile = async (
  supabase: SupabaseClient<Database>,
  profileId: string,
  updates: ProfileUpdate
): Promise<Profile | null> => {
  log.info(`${updateProfile.name} called`, { profileId, updates });

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    log.error(updateProfile.name, { error, profileId, updates });
    throw new Error(`プロファイルの更新に失敗しました: ${error.message}`);
  }

  log.info(`${updateProfile.name} updated successfully`, { data });
  return data;
};

/**
 * 現在のユーザーのプロファイルを更新
 */
export const updateCurrentProfile = async (
  supabase: SupabaseClient<Database>,
  updates: ProfileFormData
): Promise<Profile | null> => {
  log.info(`${updateCurrentProfile.name} called`, { updates });

  const user = await getCurrentUser(supabase);
  if (!user) {
    throw new Error("ログインが必要です");
  }

  const profileUpdate: ProfileUpdate = {
    full_name: updates.fullName,
    username: updates.username,
    website: updates.website,
    avatar_url: updates.avatarUrl,
  };

  return updateProfile(supabase, user.id, profileUpdate);
};

/**
 * プロファイルをupsert（存在しない場合は作成、存在する場合は更新）
 */
export const upsertProfile = async (
  supabase: SupabaseClient<Database>,
  profileData: ProfileInsert
): Promise<Profile | null> => {
  log.info(`${upsertProfile.name} called`, { profileData });

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    log.error(upsertProfile.name, { error, profileData });
    throw new Error(`プロファイルのupsertに失敗しました: ${error.message}`);
  }

  log.info(`${upsertProfile.name} upserted successfully`, { data });
  return data;
};

/**
 * プロファイルを削除
 */
export const deleteProfile = async (
  supabase: SupabaseClient<Database>,
  profileId: string
): Promise<boolean> => {
  log.info(`${deleteProfile.name} called`, { profileId });

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId);

  if (error) {
    log.error(deleteProfile.name, { error, profileId });
    throw new Error(`プロファイルの削除に失敗しました: ${error.message}`);
  }

  log.info(`${deleteProfile.name} deleted successfully`, { profileId });
  return true;
};

/**
 * 現在のユーザーのプロファイルを削除
 */
export const deleteCurrentProfile = async (
  supabase: SupabaseClient<Database>
): Promise<boolean> => {
  log.info(`${deleteCurrentProfile.name} called`);

  const user = await getCurrentUser(supabase);
  if (!user) {
    throw new Error("ログインが必要です");
  }

  return deleteProfile(supabase, user.id);
};

/**
 * ユーザーネームの重複チェック
 */
export const checkUsernameAvailability = async (
  supabase: SupabaseClient<Database>,
  username: string,
  excludeUserId?: string
): Promise<boolean> => {
  log.info(`${checkUsernameAvailability.name} called`, { username, excludeUserId });

  let query = supabase
    .from("profiles")
    .select("id")
    .eq("username", username);

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data, error } = await query;

  if (error) {
    log.error(checkUsernameAvailability.name, { error, username });
    return false;
  }

  const isAvailable = !data || data.length === 0;
  log.info(`${checkUsernameAvailability.name} checked`, { username, isAvailable });
  
  return isAvailable;
};

/**
 * プロファイル検索
 */
export const searchProfiles = async (
  supabase: SupabaseClient<Database>,
  searchTerm: string,
  options?: {
    limit?: number;
    fields?: ("username" | "full_name")[];
  }
): Promise<Profile[]> => {
  log.info(`${searchProfiles.name} called`, { searchTerm, options });

  const fields = options?.fields || ["username", "full_name"];
  const limit = options?.limit || 10;

  let query = supabase.from("profiles").select("*").limit(limit);

  // 複数フィールドでのOR検索
  const orConditions = fields
    .map(field => `${field}.ilike.%${searchTerm}%`)
    .join(",");

  query = query.or(orConditions);

  const { data, error } = await query;

  if (error) {
    log.error(searchProfiles.name, { error, searchTerm });
    return [];
  }

  log.info(`${searchProfiles.name} searched successfully`, { 
    searchTerm, 
    count: data?.length 
  });
  
  return data || [];
};
