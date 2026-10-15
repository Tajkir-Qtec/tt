# Marriage Cards

Digital wedding invitations: professional templates, a Canva-style editor, personal guest links and PDF download.

**Templates:** 55 (weddings across Bengali, South Asian, Islamic, Chinese, Persian, Moroccan, Greek, African and modern styles, plus birthday, baby shower, bridal shower, engagement, anniversary, Eid, Diwali, Boishakh and dinner-party designs).

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind v4 · Konva (canvas editor) · Zustand · MongoDB (Mongoose) · Firebase Auth · jsPDF · Framer Motion

## Run it

```bash
npm install
cp .env.example .env.local      # then fill it in (see below)
npm run dev                     # http://localhost:3000
```

`.env.local` (already created for local dev):

| Variable | What |
|---|---|
| `MONGODB_URI` | Local `mongodb://127.0.0.1:27017/marriage-cards` or an Atlas URI |
| `NEXT_PUBLIC_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_APP_ID` | Firebase console → Project settings → Web app. Enable **Google** and **Email/Password** under Authentication |
| `NEXT_PUBLIC_SITE_URL` | Your public URL (canonical links, sitemap, link previews) |
| `ADMIN_EMAILS` | Comma-separated emails allowed into **/admin** (must be a *verified* Firebase email, e.g. your Gmail). `dev@example.com` is the demo user |
| `AUTH_DEV_BYPASS`, `NEXT_PUBLIC_AUTH_DEV_BYPASS` | **Dev only**: shows a "Continue as demo user" button when Firebase isn't configured. Ignored when `NODE_ENV=production`. Delete once Firebase is set up |

The server verifies Firebase ID tokens itself (no service account needed — only the project id).

## How it works

- A card is **JSON**: `pages[] → layers[]` (text, shape, ornament, image). Templates and user designs share this model (`src/lib/design/types.ts`), so one editor serves both "pick a template" and "design from scratch".
- **Templates** are code in `src/lib/templates/*.ts` (one file per template, registered in `index.ts`). Decorative art is procedurally generated vector paths (`src/lib/design/ornaments.ts`) — all original, no stock assets.
- **Viewer** (`/c/[slug]`) renders pages to images in the browser and shows them as a flip card, a scrolling story, or a single image — chosen by the card's owner.
- **Guest names:** put `{to}` in any text layer (Text → *Guest name*). `?to=Sarah+Khan` fills it. A card with no `{to}` ignores `?to=` entirely, and layers with `{to}` are hidden when no name is given. Names are sanitised (letters/digits/few punctuation, 40 chars).
- **Privacy/SEO:** marketing, template and category pages are indexed (see `sitemap.ts`, JSON-LD). Published cards are `noindex` (they contain venues/dates) but still produce WhatsApp/Facebook link previews.
- Images and link previews are stored in MongoDB and served from `/api/media/[id]`. Swap for S3/Cloudinary later if traffic grows.

## Guest replies (RSVP)

Optional and simple: a guest taps **Will you join us?** on the card and picks *I'll be there* (name, phone, how many people) or *Can't make it* (name). Owners see the live list at **My cards → "N coming"** (`/guests/[id]`): totals, search, remove, CSV export. Replies can be switched off per card (Details tab). Spam protection: per-device rate limit, honeypot field, phone/name validation, per-card cap.

## Envelope intro & QR codes

- The animated envelope (8 colours) opens before the card; turn it on/off in the editor's *Details* tab.
- QR codes: **Elements → QR code** adds a vector QR of the card link onto the page (prints crisp on the PDF); the share dialog also offers a PNG download. If you rename the link, add the QR again.

## Upload your own card (`/upload`)

Guests-ready sharing for cards that already exist: upload one or more photos/images, the in-browser scanner (`src/lib/scan.ts`) finds the card edges, lets you drag the four corners, straightens it (perspective warp) and optionally cleans colours. The result becomes a normal card (one image page per upload) you can open in the editor to add a guest-name line, QR, envelope and publish. Nothing is uploaded until you press Continue.

## Admin console (`/admin`)

Separate from the user app, with its own sign-in at `/admin/login` (only emails in `ADMIN_EMAILS`; non-admins are signed straight back out). Sections: **Dashboard** (KPIs with sparklines, 7/30-day charts, activation funnel, attention list, live activity), **Users** (filters, detail drawer with cards/activity/private note, suspend/reinstate), **Cards** (take down / restore / delete), **Templates** (usage, publish rate, views, replies per template), **Reports**, **Audit log** (filter + CSV export), **Settings** (announcement banner, maintenance mode, sign-ups / replies switches, per-user limits) and **System** (DB health, collection sizes, readiness checklist).

## Template tooling (dev only)

```bash
node scripts/shot.mjs <slug> <page> <scale> ["Guest Name"]   # screenshot a template page → .shots/
node scripts/gen-thumbs.mjs [slug]                           # regenerate public/templates/*.jpg (needs dev server)
```

After adding/editing a template: register it in `src/lib/templates/index.ts`, then run `gen-thumbs`.
`/dev/preview` is blocked in production.

## Scripts

`npm run dev` · `npm run build` · `npm start` · `npm run lint`

## Next steps worth considering

RSVP + guest dashboard, phone-number sign-in (Firebase), animated envelope intro, background music, QR code on the PDF, public gallery (opt-in), premium templates / pay-per-share once there's an audience.
