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

### Without marblet

Testing an operator with raw `TestScheduler` requires repetitive scaffolding:

```ts
new TestScheduler((actual, expected) => expect(actual).toEqual(expected))
  .run(({ cold, expectObservable }) => {
    const source$ = cold('a-b-c-d|', { a: 1, b: 2, c: 3, d: 4 });
    const result$ = source$.pipe(
      filter(n => n % 2 === 0),
      map(n => n * 2)
    );
    expectObservable(result$).toBe('--b---d|', { b: 4, d: 8 });
  });
```

### With marblet

marblet collapses that into a declarative unit — input marble, output marble, and the operator under test together:

```ts
import { marblet, expectUpstream } from 'marblet';

marblet(
  'a-b-c-d|',
  '--b---d|',
  expectUpstream({ a: 1, b: 2, c: 3, d: 4 })
    .pipe(source$ => source$.pipe(filter(n => n % 2 === 0), map(n => n * 2)))
    .toBe({ b: 4, d: 8 })
).assess((actual, expected) => expect(actual).toEqual(expected));
```

`assess()` accepts any `(actual, expected) => void` function, so it should work with Vitest, Jest, or any other assertion library.

For more examples see [tests](./tests).
