.PHONY: test
test: install
	yarn test

.PHONY: install
install:
	yarn
