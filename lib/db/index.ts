import { Tables } from "./database.types";

export * from "./database.types";
export * from "./profile";
export type Profile = Tables<"profiles">;
