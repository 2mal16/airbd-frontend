# BIDS Dataset Explorer — frontend

A Vite + React + TypeScript front end for the [BIDS Dataset Explorer
API](https://backend-19c991af.fastapicloud.dev), built with
[shadcn/ui](https://ui.shadcn.com) and themed in the Wyss Center's brand.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

Point it at a local backend with `VITE_API_BASE_URL` (see `.env.example`); with
nothing set it falls back to the deployed API.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Discovery: faceted filtering, search, sorting, pagination |
| `/datasets/:datasetId` | One dataset: metadata, validation report, README, participants |
| `/validate` | Checks dataset-relative paths against BIDS naming rules |
| `/about` | How the catalogue is built, and which API it is talking to |

Filter state lives in the URL query string rather than component state, so a
filtered view is a link: shareable, bookmarkable, and intact after a reload.
`src/hooks/use-dataset-query.ts` owns that translation in both directions.

## Branding

The palette and typography are taken from
[wysscenter.ch](https://wysscenter.ch)'s own stylesheet — its
`--wp--preset--color--*` custom properties and the two typefaces it loads —
rather than eyeballed from screenshots:

| Token | Source | Used for |
| --- | --- | --- |
| `#0ee59e` | `primary-green` | Primary actions, valid-dataset accents |
| `#08a974` / `#077e57` | `green-dark` / `green-darker` | Links and focus rings, where the mint is too light to read |
| `#effef9` | `green-lighter` | Accent surfaces |
| `#2b3949` | `greydark` | The dark theme's surfaces |
| `#f8f8f8`, `#e6e6e6`, `#d8d8d8` | `greylighter`…`grey` | Neutrals |

The mint is a light colour, so it carries dark text rather than white, and
focus rings use `green-dark` instead. Type is **IBM Plex Sans** with **IBM Plex
Mono** for identifiers and paths, self-hosted via Fontsource. Headings are
light-weight and tightly tracked (`-0.02em`), matching the site; the uppercase,
letter-spaced treatment is reserved for small labels, which is what the
`eyebrow` utility in `src/index.css` is for. Corner radius is 12px, the value
their CSS uses most.

The mark is a typographic lockup in that palette rather than a copy of the Wyss
Center logo file — the brand without shipping an asset we do not own. Drop the
real logo into `src/components/app/brand.tsx` when you have it.

## Layout

```
src/lib/types.ts               API wire types, mirroring the backend's OpenAPI
src/lib/api.ts                 typed fetch client
src/lib/format.ts              byte/date/duration formatting and facet labels
src/hooks/use-dataset-query.ts filter state <-> URL query string
src/components/app/            brand, layout, facets, dataset card
src/components/ui/             shadcn/ui primitives
src/pages/                     discover, dataset detail, path check, about
```

## Deploy

Deployed on Vercel. `vercel.json` rewrites every path to `index.html` so
client-side routes survive a hard refresh, and fingerprinted assets are served
immutable. Set `VITE_API_BASE_URL` in the project's environment variables to
point a deployment at a different backend.
