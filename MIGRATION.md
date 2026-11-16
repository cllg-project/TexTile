# Migrating the frontend: `1785c10` → this release

For a deployment running the previous release (commit `1785c10`, "add htr evaluation section to about
page"). **Deploy the backend first**: follow the backend `MIGRATION.md` (re-index, deploy the API, verify).
This release calls API endpoints that the previous backend does not have (`/collections/search/`,
`/manuscripts/facets/`, `/concordance/…`, and the `language`, `start_year`, `stop_year` and `within`
filters of `/manuscripts/`), so against an old backend the library and text search pages do not work.

Nothing in the build tooling changed: Node `^20.19.0 || >=22.12.0`, `npm ci`, `npm run build`. The
production build is in `dts-ui/dist/`.

## In short

1. Backend migrated and verified (`python migrate.py verify` there).
2. Check `VITE_DTS_BASE_URL` (below).
3. `cd dts-ui && npm ci && npm run build`, publish `dist/`.
4. Make sure `index.html` is not cached for long (below).

## 1. Configuration

`dts-ui/.env` (or the build environment) still has a single variable:

```
VITE_DTS_BASE_URL=https://example.org/dts
```

It must be **the same address as the backend's `PUBLIC_BASE_URL`**, path prefix included. A trailing slash is
now tolerated (`https://example.org/dts/` used to produce `//collection/`). The value is read at build
time: rebuild after changing it.

## 2. Build and publish

```bash
cd dts-ui
npm ci
npx eslint .        # CI runs this; `npm run lint` would rewrite files because of --fix
npm run build
```

The build now produces several JavaScript files: each page (library, collection, reader, search, about) is
loaded when it is first opened. The main bundle went from 1.37 MB to about 0.6 MB.

- File names contain a content hash, so they can be cached for a long time, **but `index.html` must not be**
  (it is the file that names the new chunks). A browser holding an old `index.html` and a server that no
  longer has the old chunks shows a blank page on navigation until the next reload.
- Keep serving `index.html` for unknown paths (`/catalog`, `/collection/…`, `/doc/…`, `/search`): that was
  already required and is unchanged.

## 3. What changed for users

- **Library** (`/catalog`): the typeahead and the tree are replaced by a search form (with language and year
  filters) and, with no query, the top-level collections. Results have separate tabs for manuscripts and
  collections, each paginated; the state is in the URL.
- **Collection pages** (`/collection/:id`): each collection has its own page with breadcrumbs, sub-collections,
  a paginated list of manuscripts, sorting, and a search box that searches inside that collection (and its
  sub-collections).
- **Text search** (`/search`): simplified (search tips and the keyboard are opened on demand), plus three tabs:
  *Passages*, *Concordance* (keyword in context, with a CSV export) and *Statistics* (frequencies, streamed with a
  loading indicator). The URL carries `view=concordance|stats`.
- **Reader**: uses the full window width, with tighter margins.
- **About / project pages**: the paper links point to the LREC 2026 paper (HAL `hal-05299220v2`), the BibTeX
  citation is the `@inproceedings` entry, and the MyDapytains link points to
  `distributed-text-services/MyDapytains`.

## 4. Removed

`CatalogTree.vue`, `Modal.vue`, `NavPager.vue`, `RightPanel.vue`, `DocumentPane.vue` (none was used any more),
the old infinite-scroll catalog with its "legacy browse" and "metadata search" modes (their language and date
searches are now filters), the unused vector/hybrid search code paths, and some unused locale strings. The
API helpers `searchManuscripts`, `fetchManuscriptsList` and `fetchCollectionsList` of `src/api/dts.js` are gone
too: anything importing them must use `searchCatalogManuscripts`, `searchCatalogCollections` and
`fetchCatalogFacets`.

## 5. Verify

Open, in a private window (to bypass cached files):

- `/catalog`: top-level collections appear; search `smith 19` finds one manuscript; `francais` and `français`
  give the same results.
- `/collection/<id>` of any collection: breadcrumbs and contents; the search box searches inside it.
- `/search?q=et`: *Passages* shows hits; *Concordance* shows a table; *Statistics* shows a spinner with a page
  count, then the figures. A second visit is served from the backend's cache and says "Saved result from …".
- A manuscript in the reader, with the browser's network tab open: no request goes to an unexpected host
  (that would mean a wrong `VITE_DTS_BASE_URL`).

## Rollback

Redeploy the previous build of `dist/`. Against the new backend it works except that child counts in the
collection tree read `0` (it expects the old top-level `nb_children`, which the API now puts in
`extensions.nb_children`).

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Blank page after a deployment | A browser has the old `index.html`: reload; cache `index.html` for a short time only. |
| The library page shows an error or no results | The backend has not been migrated (missing endpoints) or `VITE_DTS_BASE_URL` points to the wrong host: it needs a rebuild after any change. |
| CORS error in the console | Add the frontend's exact origin to the backend's `ALLOWED_ORIGINS`. |
| Statistics: "The server is busy…" | Too many statistics running at once on the server; use *Try again*. |
