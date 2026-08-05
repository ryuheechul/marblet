# The test script (package.json) builds the package before running vitest, so
# tests exercise the built dist/ by design (see tests/marblet.test.ts).
.PHONY: test
test: install
	pnpm test

.PHONY: build
build: install
	pnpm build

.PHONY: install
install:
	pnpm install
