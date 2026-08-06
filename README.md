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
npm start
```

Serves the built UI and API from port `8787` (or `PORT`).

## Stack

- Vite + React (public calendar/map)
- Express API (`server/`) with cookie/bearer auth
- Heuristic email parser (`src/lib/parseEmail.ts`)
