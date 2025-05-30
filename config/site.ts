import { env } from "@/env.mjs";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "LIFF-Business-System",
  description:
    "業務管理システム（LIFF対応）",
  links: {
    x: "https://twitter.com/nphivu414",
    github: "https://github.com/nphivu414/ai-fusion-kit",
    docs: "",
  },
};

export const getURL = () => {
  let url = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};
