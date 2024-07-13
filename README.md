# bankas.skafis.lt

Problems for content bank (school problem repository).

uses API. https://api.bankas.skafis.lt/v3/api-docs

## Tech

- svelte, vite, typescript, pnpm
- firebase auth
- firebase storage
- firebase firestore
- google analytics
- svelte flowbite components
- svelte flowbite icons
- github actions
- openapi-generator-cli

## Dev

pnpm install

pnpm dev

gen services and models from openapi docs - pnpm genapi

run backend locally - docker compose up -d, don't forget to change BASE_URL in src/services/gen-client/base.ts file, also create .env file from .env.template and put the path to firebase-admin.json file (to access firebase)

## prod

branches: main & dev

- dev - for dev and test, when PR to main created, deploys temp on firebase via gh actions to some random link.
- main - when PR merged to main, deploys to firebase via gh actions to https://bankas.skafis.lt
