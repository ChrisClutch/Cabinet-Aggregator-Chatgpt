import { env } from "cloudflare:workers";
import { z } from "zod";
import {
  db,
  bucket,
  uid,
  digest,
  passwordHash,
  identity,
  allSuppliers,
  assumptions,
  json,
  sameOrigin,
  rate,
} from "@/lib/server";
import { defaults, photos, sectors } from "@/lib/catalog";
const short = z.string().trim().min(1).max(250);
const profile = z
  .object({
    name: short,
    location: short,
    material: short,
    construction: short,
    price: short,
    origin: short,
    lead: z.coerce.number().int().min(0).max(104),
    min: z.coerce.number().int().min(0).max(100000),
    max: z.coerce.number().int().min(0).max(100000),
    installation: short,
    certification: short,
    experience: short,
    description: z.string().trim().min(20).max(2000),
  })
  .refine(
    (p) => p.max === 0 || p.max >= p.min,
    "Maximum units must be at least the minimum",
  );
const quote = z.object({
  name: short,
  email: z.string().email().max(254),
  company: short,
  type: z.enum(sectors.map((s) => s.name) as [string, ...string[]]),
  city: short,
  state: z.string().regex(/^[A-Z]{2}$/),
  units: z.coerce.number().int().min(12).max(100000),
  kitchens: z.coerce.number().int().min(0).max(100000),
  bathrooms: z.coerce.number().int().min(0).max(200000),
  timeline: short,
  specifications: z.string().trim().min(20).max(10000),
  budget: z.coerce.number().min(0).max(1e10),
  delivery: short,
  installation: short,
  recipients: z.array(short).min(1).max(5),
  consent: z.literal(true),
});
export async function GET(req: Request) {
  try {
    const path = new URL(req.url).pathname.split("/").slice(2);
    const who = await identity(req);
    if (path[0] === "catalog")
      return json({
        suppliers: await allSuppliers(),
        assumptions: await assumptions(),
        user: who,
      });
    if (path[0] === "file") {
      if (!who) return json({ error: "Sign in required" }, 401);
      const f = await db()
        .prepare("SELECT * FROM files WHERE id=?")
        .bind(path[1] || "")
        .first<{ id: string; quote: string; name: string }>();
      if (!f) return json({ error: "Not found" }, 404);
      if (
        who.role !== "admin" &&
        !(await db()
          .prepare("SELECT id FROM recipients WHERE quote=? AND supplier=?")
          .bind(f.quote, who.user)
          .first())
      )
        return json({ error: "Not authorized" }, 403);
      const object = await bucket().get(f.id);
      if (!object) return json({ error: "Not found" }, 404);
      return new Response(object.body, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${f.name.replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    if (path[0] === "dashboard") {
      if (!who) return json({ error: "Sign in required" }, 401);
      const admin = who.role === "admin";
      const rows = await db()
        .prepare(
          admin
            ? "SELECT * FROM quotes ORDER BY created DESC"
            : "SELECT q.* FROM quotes q JOIN recipients r ON q.id=r.quote WHERE r.supplier=? ORDER BY q.created DESC",
        )
        .bind(...(admin ? [] : [who.user]))
        .all<{ id: string; data: string; created: string; status: string }>();
      const leads = [];
      for (const r of rows.results) {
        const rec = await db()
          .prepare(
            "SELECT supplier,status,response FROM recipients WHERE quote=?" +
              (admin ? "" : " AND supplier=?"),
          )
          .bind(r.id, ...(admin ? [] : [who.user]))
          .all();
        const fs = await db()
          .prepare("SELECT id,name FROM files WHERE quote=?")
          .bind(r.id)
          .all();
        const data = JSON.parse(r.data);
        if (!admin) delete data.recipients;
        leads.push({ ...r, data, recipients: rec.results, files: fs.results });
      }
      const suppliers = await allSuppliers(true);
      const eventRows = admin
        ? await db()
            .prepare("SELECT kind,COUNT(*) AS count FROM events GROUP BY kind")
            .all()
        : { results: [] };
      return json({
        user: who,
        leads,
        suppliers: admin
          ? suppliers
          : suppliers.filter((s) => s.id === who.user),
        events: eventRows.results,
        assumptions: await assumptions(),
      });
    }
    return json({ error: "Not found" }, 404);
  } catch {
    return json(
      { error: "Unable to load data. Check local database setup." },
      500,
    );
  }
}
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return json({ error: "Invalid request origin" }, 403);
    const path = new URL(req.url).pathname.split("/").slice(2);
    const who = await identity(req);
    const action = path[0];
    if (Number(req.headers.get("content-length") || 0) > 11 * 1024 * 1024)
      return json({ error: "Request is too large" }, 413);
    if (action === "logout") {
      const token = req.headers
        .get("cookie")
        ?.match(/(?:^|; )ccm_session=([^;]+)/)?.[1];
      if (token)
        await db()
          .prepare("DELETE FROM sessions WHERE token=?")
          .bind(await digest(token))
          .run();
      return new Response("{}", {
        headers: {
          "Set-Cookie":
            "ccm_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
          "Content-Type": "application/json",
        },
      });
    }
    if (action === "quote") {
      if (!(await rate(req, "quote")))
        return json(
          { error: "Too many requests. Please try again later." },
          429,
        );
      const form = await req.formData();
      const data = quote.parse(JSON.parse(String(form.get("data"))));
      data.recipients = [...new Set(data.recipients)];
      const available = await allSuppliers();
      if (data.recipients.some((id) => !available.some((s) => s.id === id)))
        return json({ error: "Select approved suppliers only" }, 400);
      const file = form.get("file");
      let fileId: string | undefined;
      let fileName = "";
      if (file instanceof File && file.size) {
        if (
          file.size > 10 * 1024 * 1024 ||
          file.type !== "application/pdf" ||
          !file.name.toLowerCase().endsWith(".pdf")
        )
          return json(
            { error: "Only PDF files up to 10 MB are accepted" },
            400,
          );
        const bytes = await file.arrayBuffer();
        if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-")
          return json({ error: "Invalid PDF file" }, 400);
        fileId = uid();
        fileName = file.name.slice(0, 180);
        await bucket().put(fileId, bytes, {
          httpMetadata: { contentType: "application/pdf" },
        });
      }
      const id = uid();
      try {
        const statements = [
          db()
            .prepare(
              "INSERT INTO quotes(id,data,created,status) VALUES(?,?,?,?)",
            )
            .bind(id, JSON.stringify(data), new Date().toISOString(), "New"),
          ...data.recipients.map((s) =>
            db()
              .prepare(
                "INSERT INTO recipients(id,quote,supplier,status) VALUES(?,?,?,?)",
              )
              .bind(uid(), id, s, "Pending"),
          ),
          db()
            .prepare("INSERT INTO events(id,kind,created) VALUES(?,?,?)")
            .bind(uid(), "Quote submitted", new Date().toISOString()),
        ];
        if (fileId)
          statements.push(
            db()
              .prepare("INSERT INTO files(id,quote,name) VALUES(?,?,?)")
              .bind(fileId, id, fileName),
          );
        await db().batch(statements);
      } catch (e) {
        if (fileId) await bucket().delete(fileId);
        throw e;
      }
      return json(
        {
          id,
          message:
            "Request saved locally. Only your selected supplier accounts and marketplace administrators can access it. No email has been sent.",
        },
        201,
      );
    }
    const data = await req.json();
    if (action === "login") {
      if (!(await rate(req, "login", 30)))
        return json(
          { error: "Too many login attempts. Try again later." },
          429,
        );
      const input = z
        .object({
          email: z.string().min(1).max(254),
          password: z.string().min(1).max(200),
        })
        .parse(data);
      let user = "",
        role = "supplier";
      if (
        input.email === "admin@local" &&
        env.ADMIN_PASSWORD &&
        (await digest(input.password)) === (await digest(env.ADMIN_PASSWORD))
      ) {
        user = "admin";
        role = "admin";
      } else {
        const row = await db()
          .prepare("SELECT * FROM users WHERE email=?")
          .bind(input.email.toLowerCase())
          .first<{ password: string; supplier: string }>();
        if (
          row &&
          (await passwordHash(input.password, row.password.split(":")[0])) ===
            row.password
        )
          user = row.supplier;
      }
      if (!user) return json({ error: "Email or password is incorrect" }, 401);
      const token = uid() + uid();
      await db()
        .prepare(
          "INSERT INTO sessions(token,user,role,expires) VALUES(?,?,?,?)",
        )
        .bind(await digest(token), user, role, Date.now() + 8 * 3600000)
        .run();
      return new Response(JSON.stringify({ user, role }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "Set-Cookie": `ccm_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${new URL(req.url).protocol === "https:" ? "; Secure" : ""}`,
        },
      });
    }
    if (action === "register") {
      if (!(await rate(req, "register", 10)))
        return json({ error: "Too many registrations" }, 429);
      const input = z
        .object({
          email: z.string().email().max(254),
          password: z.string().min(12).max(128),
          profile: profile,
        })
        .parse(data);
      if (
        await db()
          .prepare("SELECT id FROM users WHERE email=?")
          .bind(input.email.toLowerCase())
          .first()
      )
        return json(
          { error: "An account with this email already exists" },
          409,
        );
      const id = uid();
      await db().batch([
        db()
          .prepare(
            "INSERT INTO users(id,email,password,supplier) VALUES(?,?,?,?)",
          )
          .bind(
            uid(),
            input.email.toLowerCase(),
            await passwordHash(input.password),
            id,
          ),
        db()
          .prepare(
            "INSERT INTO suppliers(id,data,status,featured) VALUES(?,?,?,0)",
          )
          .bind(
            id,
            JSON.stringify({ ...input.profile, demo: false, image: photos[1] }),
            "Pending",
          ),
      ]);
      return json(
        {
          message:
            "Application saved. Sign in to manage your profile. Admin approval is required before it appears in the directory.",
        },
        201,
      );
    }
    if (action === "event") {
      if (!(await rate(req, "event", 200))) return json({}, 429);
      const kind = z
        .object({
          kind: z.enum([
            "Directory viewed",
            "Comparison viewed",
            "Estimator viewed",
          ]),
        })
        .parse(data).kind;
      await db()
        .prepare("INSERT INTO events(id,kind,created) VALUES(?,?,?)")
        .bind(uid(), kind, new Date().toISOString())
        .run();
      return json({ ok: true });
    }
    if (!who) return json({ error: "Sign in required" }, 401);
    if (action === "profile") {
      if (who.role !== "supplier")
        return json({ error: "Supplier access required" }, 403);
      const p = profile.parse(data);
      await db()
        .prepare("UPDATE suppliers SET data=?,status=? WHERE id=?")
        .bind(
          JSON.stringify({ ...p, demo: false, image: photos[1] }),
          "Pending",
          who.user,
        )
        .run();
      return json({
        message: "Profile saved and returned to the approval queue.",
      });
    }
    if (action === "respond") {
      const input = z
        .object({
          quote: short,
          status: z.enum(["Reviewing", "Quoted", "Declined"]),
          response: z.string().trim().min(5).max(5000),
        })
        .parse(data);
      if (who.role !== "supplier")
        return json({ error: "Supplier access required" }, 403);
      const r = await db()
        .prepare(
          "UPDATE recipients SET status=?,response=? WHERE quote=? AND supplier=?",
        )
        .bind(input.status, input.response, input.quote, who.user)
        .run();
      return r.meta.changes
        ? json({ ok: true })
        : json({ error: "Not authorized" }, 403);
    }
    if (who.role !== "admin")
      return json({ error: "Admin access required" }, 403);
    if (action === "supplier") {
      const input = z
        .object({
          id: short,
          status: z.enum(["Pending", "Approved", "Rejected"]),
          featured: z.boolean(),
        })
        .parse(data);
      const s = (await allSuppliers(true)).find((s) => s.id === input.id);
      if (!s) return json({ error: "Not found" }, 404);
      await db()
        .prepare(
          "INSERT INTO suppliers(id,data,status,featured) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,featured=excluded.featured",
        )
        .bind(s.id, JSON.stringify(s), input.status, Number(input.featured))
        .run();
      return json({ ok: true });
    }
    if (action === "lead") {
      const input = z
        .object({
          id: short,
          status: z.enum([
            "New",
            "Qualified",
            "In progress",
            "Awarded",
            "Closed",
          ]),
        })
        .parse(data);
      await db()
        .prepare("UPDATE quotes SET status=? WHERE id=?")
        .bind(input.status, input.id)
        .run();
      return json({ ok: true });
    }
    if (action === "assumptions") {
      const shape = Object.fromEntries(
        Object.keys(defaults).map((k) => [
          k,
          z
            .number()
            .finite()
            .min(k === "units" ? 1 : 0)
            .max(k === "freight" || k === "contingency" ? 100 : 100000),
        ]),
      );
      const values = z.object(shape).parse(data);
      await db()
        .prepare(
          "INSERT INTO settings(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data",
        )
        .bind("estimate", JSON.stringify(values))
        .run();
      return json({ ok: true });
    }
    return json({ error: "Not found" }, 404);
  } catch (e) {
    return json(
      {
        error:
          e instanceof z.ZodError
            ? e.issues
                .map((i) => i.path.join(".") + ": " + i.message)
                .join("; ")
            : "Request could not be saved. Check inputs and local database setup.",
      },
      400,
    );
  }
}
