import { env } from "cloudflare:workers";
import { seed, defaults, type Supplier } from "./catalog";
export const db = () => env.DB!;
export const bucket = () => env.BUCKET!;
export const uid = () => crypto.randomUUID();
export async function digest(s: string) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
    ),
  )
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
export async function passwordHash(password: string, salt = uid()) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return (
    salt +
    ":" +
    Array.from(new Uint8Array(bits))
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}
export async function identity(req: Request) {
  const cookie = req.headers
    .get("cookie")
    ?.match(/(?:^|; )ccm_session=([^;]+)/)?.[1];
  if (!cookie) return null;
  return await db()
    .prepare("SELECT user,role FROM sessions WHERE token=? AND expires>?")
    .bind(await digest(cookie), Date.now())
    .first<{ user: string; role: string }>();
}
export async function allSuppliers(
  includePending = false,
): Promise<Supplier[]> {
  const { results } = await db()
    .prepare("SELECT * FROM suppliers")
    .all<{ id: string; data: string; status: string; featured: number }>();
  const overrides = new Map(results.map((r) => [r.id, r]));
  const merged = seed.map((s) => {
    const r = overrides.get(s.id);
    return r
      ? {
          ...s,
          ...JSON.parse(r.data),
          id: r.id,
          status: r.status,
          featured: !!r.featured,
        }
      : s;
  });
  for (const r of results)
    if (!seed.some((s) => s.id === r.id))
      merged.push({
        ...JSON.parse(r.data),
        id: r.id,
        status: r.status,
        featured: !!r.featured,
      });
  return merged
    .filter((s) => includePending || !s.status || s.status === "Approved")
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}
export async function assumptions() {
  const r = await db()
    .prepare("SELECT data FROM settings WHERE id=?")
    .bind("estimate")
    .first<{ data: string }>();
  return r ? JSON.parse(r.data) : defaults;
}
export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  return origin === new URL(req.url).origin;
}
export async function rate(req: Request, kind: string, max = 12) {
  const ip = req.headers.get("CF-Connecting-IP") || "local";
  const id = await digest(ip + kind + Math.floor(Date.now() / 3600000));
  await db()
    .prepare(
      "INSERT INTO limits(id,count,expires) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1",
    )
    .bind(id, Date.now() + 3600000)
    .run();
  const r = await db()
    .prepare("SELECT count FROM limits WHERE id=?")
    .bind(id)
    .first<{ count: number }>();
  return (r?.count || 0) <= max;
}
