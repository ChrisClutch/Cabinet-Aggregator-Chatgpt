import { siteConfig } from "@/lib/site-config";
import Link from "@/components/link";

/** Architectural cabinet elevation: paired doors, a continuous frame and brass pulls. */
export default function Brand() {
  return (
    <Link
      className="brand identity"
      href="/"
      aria-label={`${siteConfig.name} home`}
    >
      <svg
        className="identity-mark"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path d="M5 6h38v36H5z" fill="var(--walnut)" />
        <path d="M11 12h26v24H11z" stroke="#FAFAF6" strokeWidth="1.5" />
        <path d="M24 12v24" stroke="#FAFAF6" strokeWidth="1.5" />
        <path d="M20 21v6m8-6v6" stroke="var(--orange)" strokeWidth="2" />
        <path d="M5 2h38" stroke="var(--graphite)" strokeWidth="2" />
      </svg>
      <span className="identity-type">
        {siteConfig.name.replace(/ Marketplace$/, "")}
        <span className="identity-descriptor">MARKETPLACE</span>
      </span>
    </Link>
  );
}
