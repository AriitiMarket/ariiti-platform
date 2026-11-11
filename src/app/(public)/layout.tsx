import React from "react";
import { getWebsiteSettings } from "@/lib/queries/publicData";
import AnnouncementBanner from "@/components/public/AnnouncementBanner";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloatingButton from "@/components/public/WhatsAppFloatingButton";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getWebsiteSettings();

  return (
    <>
      <AnnouncementBanner banner={settings.announcementBanner} />
      <Navbar settings={settings} />
      <main className="min-h-screen bg-ariiti-light flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppFloatingButton phone={settings.whatsappNumber} />
    </>
  );
}
