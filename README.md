# ReelRank Reviews

Frontend-only website for sharing reviews of movies, series, and shows.

## Features

- Curated catalog of titles with owner rating and owner review
- Viewer feedback form for each title
- Viewer feedback list shown below each title
- Local persistence in browser storage (no backend required)
- Works well for static hosting such as GitHub Pages

## Tech

- React + TypeScript + Vite
- Local state + localStorage for persistence

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Notes for GitHub Pages

- No backend API is used
- Viewer feedback is stored in each visitor's browser only
- If browser storage is cleared, feedback entries are removed
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
