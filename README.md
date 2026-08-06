# DFW Jazz Circuit

A small dashboard that turns the monthly DFW jazz community email into a **calendar** and **venue map**.

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## What’s included

- Parsed dated shows from **Aug. 2026 jazz events # 3** (into early October)
- Month calendar with event counts
- Day detail list (time, artist, venue, cover, tickets)
- Map view with venue pins (Leaflet / Carto dark tiles)
- Search across artists and venues
- Ongoing weekly/monthly series panel

Venue coordinates are approximate. A few source typos were normalized (e.g. July 13 lines in the August edition → Aug 13).
