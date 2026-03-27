.PHONY: test
test: install
	pnpm test

.PHONY: install
install:
	pnpm install
