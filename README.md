# bankas.skafis.lt

Problems for school bank (repository).

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

## prod

branches: main & dev

- dev - for dev and test.
- main - when merged/pushed deploys to firebase (github actions)

## stuff/process/logs

### 2024-06-18

I have backend!!! (some kind of)

Versions will be only after I make the basic upload & review stuff. This will be v1.0.0 which will be used for all the demos to get money and attention. Then I am going to start using CHANGELOG - next versions will have fully functional backend - i.e. with authetication management and with captcha management.

Now openapi-generator. It takes openapi docs and generates services and models from it for typescript frontend.

### 2024-07-05

This is very good article to understand svelte store/context/props stuff:

https://stackoverflow.com/questions/67663671/understanding-context-in-svelte-convert-from-react-context
