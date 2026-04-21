.PHONY init refresh reset setup run build test

init:
	pnpm migration:run

refresh:
	reset
	setup

reset:
	./scripts/truncate.sh

setup:
	./scripts/refresh.sh

run:
	pnpm start

build:
	pnpm build

test: 
	pnpm test
