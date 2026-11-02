import { sectors } from "@/lib/catalog";
export default function sitemap() {
  return [
    "",
    "/suppliers",
    "/industries",
    "/estimator",
    "/how-it-works",
    ...sectors.map((s) => "/industries/" + s.slug),
  ].map((path) => ({
    url: "https://commercialcabinetsmarketplace.com" + path,
  }));
}
