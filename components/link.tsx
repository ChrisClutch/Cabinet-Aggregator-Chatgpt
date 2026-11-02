import type { AnchorHTMLAttributes } from "react";
/** Standard links keep navigation resilient across Worker-rendered pages. */
export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} />;
}
