# DFW Jazz Circuit

Calendar + venue map for the monthly DFW jazz community email, with a password-protected admin UI for imports and edits.

## Run locally

```bash
npm install
npm run dev
```

- Public site: http://localhost:5173/
- Admin: http://localhost:5173/admin
- API: http://localhost:8787/api/catalog

Default admin password: `jazzadmin`  
Override with `ADMIN_PASSWORD=...` when starting the server.

## Admin workflow

1. Open `/admin` and sign in
2. **Import email** — paste the monthly email, parse, review/fix drafts, import selected rows
3. Optionally replace existing events on the imported dates
4. Use **Events** / **Venues** for one-off edits

Live data is stored in `data/db.json` (created on first API start from the built-in seed). That file is gitignored.

## Production-style run

```bash
npm run build
ADMIN_PASSWORD='strong-password' npm start
```

Serves the built UI and API from port `8787` (or `PORT`).

## Deploy on a homelab (no open ports) with Cloudflare Tunnel

If the app runs on your LAN and the router does **not** forward ports, use a Cloudflare Tunnel. The homelab dials out to Cloudflare; nothing is exposed inbound.

### 1. Run the app on the homelab

```bash
npm install
npm run build
ADMIN_PASSWORD='strong-password' PORT=8787 npm start
```

Confirm locally: `http://localhost:8787` and `/admin`.

### 2. Install cloudflared

Follow Cloudflare’s install docs:  
https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

### 3. Create a tunnel

In Cloudflare Zero Trust → **Networks** → **Tunnels**:

1. Create a tunnel (e.g. `jazz-homelab`)
2. Install/run the connector on the homelab (token command Cloudflare shows)
3. Add a public hostname:
   - **Subdomain / domain:** e.g. `jazz.yourdomain.com`
   - **Service:** `http://localhost:8787`

Cloudflare will create the DNS record (proxied CNAME) for that hostname.

### 4. Harden admin access

- Use a strong `ADMIN_PASSWORD` (never ship `jazzadmin` publicly)
- Optional but recommended: Cloudflare Access policy on `/admin` (email OTP) so the app password is not the only gate
- Back up `data/db.json` — that file is the live catalog

### 5. Smoke-check

- `https://jazz.yourdomain.com` — calendar / map
- `https://jazz.yourdomain.com/admin` — import + edits

You do **not** need to open 80/443 on the home router for this setup.

## Docker (optional)

```bash
docker build -t jazzevents .
docker run --rm -p 8787:8787 \
  -e ADMIN_PASSWORD='strong-password' \
  -v jazzevents-data:/app/data \
  jazzevents
```

Point the Cloudflare Tunnel service at `http://localhost:8787` (or the container’s host port). The volume keeps `db.json` across restarts.

## Alternatives (no homelab)

| Option | Notes |
|---|---|
| Fly.io / Railway / Render | Run `npm start`; attach a volume for `data/` |
| Cloudflare Pages alone | Static UI only — not enough for admin/API without a rewrite |
| VPS + Cloudflare proxy | Works, but needs a public host |

## Stack

- Vite + React (public calendar/map)
- Express API (`server/`) with cookie/bearer auth
- Heuristic email parser (`src/lib/parseEmail.ts`)
