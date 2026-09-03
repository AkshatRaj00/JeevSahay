# 🐾 JeevSahay

A pan-India platform to connect people with nearby animal rescuers — report an injured or stray animal, and get matched with the closest available help.

🔗 **Live:** [https://jeev-sahay.vercel.app/](https://jeev-sahay.vercel.app/)

## What it does

Animal rescue in India is fragmented — no central way to find who's nearby and available when it matters. JeevSahay solves the *discovery* problem: report a case, and the platform surfaces nearby rescuers using proximity search, without requiring either side to create heavy accounts or share more data than necessary.

## Key Features

- 📍 **Proximity-based matching** — uses geohashing to find nearby rescuers/cases fast, without expensive geo-queries
- 🔒 **Privacy-first by design** — localStorage-first data handling, so users aren't forced to hand over data they don't need to
- 🗺️ **Interactive map view** — powered by Leaflet.js for locating and reporting cases visually
- ⚡ **Lightweight & fast** — built on Vite for near-instant dev/build cycles

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite) |
| Styling | Tailwind CSS |
| Backend / Data | Firebase |
| Maps | Leaflet.js |
| Geo-search | Geohashing |

## Status

🚧 Actively in development — built module by module in a strict build order (data layer → geo-search → UI → map integration) to keep the core matching logic solid before layering on features.

## Running Locally

```bash
git clone https://github.com/AkshatRaj00/JeevSahay.git
cd JeevSahay
npm install
npm run dev
```

You'll need your own Firebase project config — copy `.env.example` to `.env` and add your Firebase keys before running.

## Roadmap

- [ ] Rescuer verification flow
- [ ] Case status tracking (reported → in progress → resolved)
- [ ] SMS/notification alerts for nearby rescuers
- [ ] Multi-language support

## Contributing

This is a solo-built project under active development — issues and PRs are welcome, especially around the matching logic and UI. Open an issue before submitting a large PR so we're aligned on direction.

## Connect

Built by **Akshat Raj** ([@AkshatRaj00](https://github.com/AkshatRaj00)) — [OnePersonAI](https://onepersonai.in)
