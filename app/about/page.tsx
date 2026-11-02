import { siteConfig } from "@/lib/site-config";
export const metadata = {
  title: "About this cabinet directory",
  description:
    "Who operates the directory, how companies are listed and how project inquiries work.",
};
export default function About() {
  return (
    <section className="section narrow editorial">
      <div className="eyebrow">FIELD NOTES / ABOUT THE DIRECTORY</div>
      <h1>Built around the work.</h1>
      <p className="lead">
        This directory is operated by {siteConfig.operator}.
      </p>
      <p>
        We bring company information, early budget examples and project briefs
        into one place so builders and developers can start better-informed
        conversations.
      </p>
      <h2>Our place in the directory.</h2>
      <p>
        Clutch Cabinets NW is the operator and founding featured supplier. Its
        placement is labeled. Featured placement is not a verified capacity
        rating or an independent recommendation.
      </p>
      <h2>Facts before claims.</h2>
      <p>
        Public listings link to company sources. Unknown capacity, lead times
        and project limits stay marked as unconfirmed. Map markers identify
        approximate cities, not verified service territories. Illustrative
        budgets are editable assumptions, not supplier offers.
      </p>
      <h2>Your brief. Your choice.</h2>
      <p>
        Commercial requests are never automatically routed to Clutch. You choose
        each recipient and authorize sharing. This local preview saves requests
        locally and sends no external emails.
      </p>
      <h2>A directory in progress.</h2>
      <p>
        Public company listings are real businesses. Separate marketplace
        profiles marked “demonstration” are fictional and exist to test
        comparison and quotation workflows. For single-kitchen projects, use the
        company website links; the marketplace quote workflow currently starts
        at 12 units.
      </p>
      <a className="button" href="/suppliers">
        Browse the directory ↗
      </a>
    </section>
  );
}
