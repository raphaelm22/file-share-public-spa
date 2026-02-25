# file-share-public-spa

Public-facing interface for the file-share platform. Allows anyone with a share token to download a file.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- React Router DOM 7
- SCSS Modules
- Vitest + @testing-library/react — unit tests

## Routes

| Route | Description |
|-------|-------------|
| `/dl/:token` | Resolve token and download the shared file |
| `*` | 404 — not found page |

## Development

### Requirements

- Node.js 22+

### Run

```bash
npm install
npm run dev
```

App available at `http://localhost:5174`. Requires the backend running at `http://localhost:5067` (configured via `.env`).

### Environment

```env
VITE_API_BASE=http://localhost:5067
```

### Tests

```bash
npx vitest run
```

## Docker

```bash
docker build -t file-share-public-spa .
docker run -p 80:80 file-share-public-spa
```

## CI/CD

On push to `main`, GitHub Actions builds and pushes the Docker image to `ghcr.io/raphaelm22/file-share-public-spa:latest`.
