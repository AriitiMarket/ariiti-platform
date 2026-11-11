import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#093053",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Ariiti Tech",
    default: "Ariiti Tech | Technology Solutions That Help Your Business Grow",
  },
  description:
    "Official corporate technology platform for Ariiti Tech. Delivering enterprise software development, commercial networking infrastructure, POS hardware systems, and proactive IT maintenance across Harar, Dire Dawa, and Eastern Ethiopia.",
  metadataBase: new URL("https://ariititech.com"),
  keywords: [
    "Ariiti Tech",
    "Ethiopia IT company",
    "Harar software development",
    "Dire Dawa networking",
    "Point of Sale Ethiopia",
    "Structured Cabling",
    "MikroTik Router Ethiopia",
    "Commercial Wi-Fi",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <head>
        {/* Pre-hydration cleanup script for browser extensions (e.g. QuickBooks data-qb-installed, Grammarly) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var el = document.documentElement;
                if (el) {
                  ['data-qb-installed', 'suppresshydrationwarning', 'data-gr-ext-installed'].forEach(function(attr) {
                    if (el.hasAttribute(attr)) {
                      el.removeAttribute(attr);
                    }
                  });
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-brand-secondary text-brand-text-body antialiased"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
