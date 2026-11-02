export const metadata = { title: "Privacy and marketplace disclosures" };
export default function Page() {
  return (
    <section className="section narrow">
      <h1>Privacy & marketplace disclosures.</h1>
      <div className="panel">
        <h2>Local development preview</h2>
        <p>
          This application stores project requests, supplier accounts and
          attachments in local Cloudflare-emulated storage. Use demonstration
          contact details and plans. No email is sent and no payments are
          collected.
        </p>
        <h2>Who can see a project?</h2>
        <p>
          Only authenticated accounts belonging to buyer-selected suppliers and
          marketplace administrators can access the project’s contact details,
          scope and attachments. Project requests are not exposed in the public
          directory.
        </p>
        <h2>Founding supplier relationship</h2>
        <p>
          Clutch Cabinets NW is affiliated with marketplace founder Chris
          Blackburn. It receives disclosed featured placement but does not
          automatically receive inquiries. Featured placement does not imply
          quality verification. Its service capabilities must be confirmed
          directly.
        </p>
        <h2>Demonstration profiles and photos</h2>
        <p>
          Profiles marked demonstration represent fictional businesses and
          illustrative capabilities. No reviews or ratings are fabricated. All
          interior photography is illustrative and is not evidence of supplier
          work.
        </p>
        <h2>Accounts and local data</h2>
        <p>
          Passwords are salted and hashed. Session cookies are HttpOnly and
          expire after eight hours. Shortlist preferences stay in your browser.
          Production requires documented retention/deletion procedures, identity
          verification, security review and a published operating privacy policy
          before collecting real customer data.
        </p>
        <h2>Estimates and commercial terms</h2>
        <p>
          Estimator defaults are editable planning assumptions, not advertised
          supplier prices. Obtain written quotations and confirm all scope,
          delivery and installation terms directly. Future featured listings,
          subscriptions and referral fees require disclosed terms; no charges
          operate in this version.
        </p>
      </div>
    </section>
  );
}
