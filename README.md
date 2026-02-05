# PixelCraft

Main site + client cabinet for PixelCraft.

## Project structure

- `server.js` - Node.js HTTP server (no Express).
- `public/` - Static assets for the main site.
- `public/cabinet/` - Built client cabinet.
- `env-loader.js` - Loads `.env` into `process.env`.

## Requirements

- Node.js 18+

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
npm install
```

## Run locally

```bash
node server.js
```

Default URL: `http://localhost:3000`

## Notes

- `.env` is intentionally gitignored.
- Cabinet UI is built separately and copied to `public/cabinet/`.
