# vue3-todos

Hello :)

This project is hosted on vercel @ https://vue3-todos-eight.vercel.app/

Add, Edit, Delete and move Tasks between a 'pending/todo' list and a 'completed' list.

Supports drag and drop
Supports keyboard navigation (TAB, ENTER, ARROWS)

dummyjson.com mocks mutation requests (POST/PATCH/DELETE) so we can't use it to actually update tasks.
I've opted to use dummyjson.com to fetch initial tasks and then manage them locally with a persisted pinia store.
the alternative would be to make the dummy requests and use the dummy response to update the local store.
if this is what was intended I am happy to make the changes :)

## Type Support for `.vue` Imports in TS

```
TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.
```

Note: this is a generated message & proposed solution to type support when importing .vue files into .ts (e.g. components into .spec.ts) - the link directs to the newer Vue Official extension not volar, this doesn't work out of the box and requires futher investigation.

I have tried a few things to fix this, however as I have multiple technical tests to complete in parallel & to prevent delaying submitting this task I've decided to skip addressing this issue at this moment, When I'm able to revisit this I will update the repo with the solution, I want to know how to solve it myself :)

https://github.com/vuejs/vue-test-utils/issues/255

I have left a couple commented out broken tests cases for the reasons as above, I thought it's better to leave them in so you can atleast see what I was trying to do. :)

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# vue3-todos
