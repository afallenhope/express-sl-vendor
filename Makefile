init:
	pnpm migration:run

refresh:
	reset
	setup

reset:
	./scripts/truncate.sh

run:
	pnpm start

build:
	pnpm build

test: 
	pnpm test
