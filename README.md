# marblet
is short for marble testing

## Why?

RxJS offers great testing features via `TestScheduler` as documented in the [official guide](https://rxjs.dev/guide/testing/marble-testing).

However I found it confusing how to get started with this but then [this post](https://medium.com/@kevinkreuzer/marble-testing-with-rxjs-testing-utils-3ae36ac3346a) was helpful for me to understand and get started.

And I made [this gist](https://gist.github.com/ryuheechul/65e4b573167d6b93158597161a08c777) and now I created this as npm package because why not.

## Install

```sh
# npm
npm install --save-dev marblet

# yarn
yarn add --dev marblet

# pnpm
pnpm add --save-dev marblet

# bun
bun add --dev marblet

# deno
deno add --dev npm:marblet
```

## How to use

Checkout [tests](./tests). It's both tests and examples.

I used [Vitest](https://vitest.dev/) for testing in there but it should have no problems being used with any testing framework.
