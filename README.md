# Skafis užduočių bankas $_{LT}$

Problems for content bank (repository for school problems and problem sets). By teachers for teachers and more.

Hosted here: https://bankas.skafis.lt

Uses API: https://api.bankas.skafis.lt/swagger-ui/index.html

## Tech

- [Svelte](https://svelte.dev/), [vite](https://vitejs.dev/), [typescript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/) auth, storage, firestore, hosting
- [Google analytics](https://analytics.google.com)
- [Svelte flowbite components](https://flowbite-svelte.com/docs/components/accordion)
- [Svelte flowbite icons](https://flowbite-svelte.com/icons/outline-icons)
- [GitHub](https://github.com) actions
- [openapi-generator-cli](https://openapi-generator.tech)
- [carta-md](https://beartocode.github.io/carta/introduction)
- [math-live](https://cortexjs.io/mathlive/)

## Dev locally

Create `.env` file from `.env.template` with environment variables.

```bash
docker-compose up -d # Runs backend on docker
npm install # Installs node packages
npm run dev # Hosts on http://localhost:5173
npm run genapi # Generates API client from http://localhost:9000/v3/api-docs
```

## Pipeline

Branches:

- dev - for dev and test (deploy preview now turned off)
- main - when PR merged to main, deploys to firebase via gh actions to https://bankas.skafis.lt

Only one instance of database is used.

## Backup

All firestore:

```bash
npm run backup-firestore
```

One collection (e.g. categories):

```bash
npm run backup-firestore categories
```

All storage:

```bash
npm run backup-storage
```
