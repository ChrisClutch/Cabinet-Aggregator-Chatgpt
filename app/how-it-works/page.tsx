import Link from "@/components/link";
export const metadata = { title: "How commercial cabinet sourcing works" };
export default function Page() {
  return (
    <section className="section narrow">
      <div className="eyebrow">A CLEARER PROCUREMENT PROCESS</div>
      <h1>From scope to shortlist.</h1>
      <div className="panel">
        <h2>1. Define your project</h2>
        <p>
          Start with unit mix, cabinet schedules, finish requirements and
          delivery phases. Use the editable estimator to establish a planning
          allowance.
        </p>
        <h2>2. Compare supplier fit</h2>
        <p>
          Filter by capabilities and compare up to four suppliers. Unknown
          fields mean you need confirmation. Demonstration profiles illustrate
          the workflow and do not represent real businesses.
        </p>
        <h2>3. Choose your recipients</h2>
        <p>
          Select up to five suppliers. Your project brief, contact details and
          plans are accessible only to those supplier accounts and marketplace
          administrators. The founder’s supplier is never added automatically.
        </p>
        <h2>4. Review responses</h2>
        <p>
          Supplier accounts can record a response in their private workspace.
          Administrators track progress and awards. This local MVP does not send
          emails, negotiate contracts or process payments.
        </p>
        <Link className="button" href="/quote">
          Start a project brief ↗
        </Link>
      </div>
    </section>
  );
}
