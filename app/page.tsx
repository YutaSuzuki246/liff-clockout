import { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { MainLayout } from "@/components/ui/common/MainLayout";
import { Dashboard } from "@/components/feature/home/conponents";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export const runtime = "edge";

export default async function Home() {
  return (
    // <MainLayout>
      <Dashboard />
    // </MainLayout>
  );
}
