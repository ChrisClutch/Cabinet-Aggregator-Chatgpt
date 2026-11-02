import type { Metadata } from "next";
import Link from "@/components/link";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import type { CSSProperties } from "react";
import Brand from "@/components/brand";
export const metadata: Metadata = {
  metadataBase: new URL("https://commercialcabinetsmarketplace.com"),
  title: {
    default: `${siteConfig.name} | Cabinet company directory`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Compare cabinet suppliers for multifamily, hospitality and commercial housing. Build a project budget and request quotes from suppliers you choose.",
  icons: { icon: "/favicon.svg" },
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={
          Object.fromEntries(
            Object.entries(siteConfig.colors).map(([k, v]) => [`--${k}`, v]),
          ) as CSSProperties
        }
      >
        <div className="topbar">
          <span>BUILT FOR PROJECTS OF 12+ UNITS</span>
          <span>A directory operated by Clutch Cabinets NW.</span>
          <a href="/how-it-works">How it works ↗</a>
        </div>
        <header>
          <Brand />
          <nav aria-label="Main navigation">
            <Link href="/suppliers">Find suppliers</Link>
            <Link href="/commercial">Commercial</Link>
            <Link href="/estimator">Cost estimator</Link>
            <Link href="/supplier">For suppliers</Link>
          </nav>
          <Link className="button small" href="/quote">
            Get project quotes <span>↗</span>
          </Link>
        </header>
        <main>{children}</main>
        <footer>
          <div className="footer-top">
            <Brand />
            <p>
              This directory is operated by Clutch Cabinets NW.
              <br />
              Shop information. Clear budgets. Buyer-selected quotes.
            </p>
            <div>
              <Link href="/suppliers">Find suppliers</Link>
              <Link href="/about">About the directory</Link>
              <Link href="/admin">Workspace sign in</Link>
              <Link href="/privacy">Privacy & disclosures</Link>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} {siteConfig.name}{" "}
            <span>
              Local MVP · Demonstration listings clearly marked · No emails sent
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
