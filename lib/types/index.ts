import { Tables } from "./database.types";

export * from "./database.types";
export * from "../db/profile";
export type Profile = Tables<"profiles">;
