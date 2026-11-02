import Link from "@/components/link";
import { sectors } from "@/lib/catalog";
export const metadata = { title: "Cabinet sourcing by industry" };
export default function Page() {
  return (
    <section className="section">
      <div className="eyebrow">
        TWELVE INDUSTRIES. ONE CONNECTED MARKETPLACE.
      </div>
      <h1>Built around your project.</h1>
      <p>
        Start with the procurement needs that make your development different.
      </p>
      <div className="industry-list">
        {sectors.map((s, i) => (
          <Link href={"/industries/" + s.slug} key={s.slug}>
            <small>0{i + 1} / SOURCING GUIDE</small>
            <h2>{s.name} ↗</h2>
            <p>{s.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
