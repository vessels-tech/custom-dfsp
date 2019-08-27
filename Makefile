

build:
	docker-compose build
	# Tag other images to save time?
	docker tag custom-dfsp_custom-dfsp:latest lewbank1_custom-dfsp:latest
	docker tag custom-dfsp_scheme-adapter:latest lewbank1_scheme-adapter:latest
	docker tag custom-dfsp_custom-dfsp:latest lewbank2_custom-dfsp:latest
	docker tag custom-dfsp_scheme-adapter:latest lewbank2_scheme-adapter:latest

watch:
	npm run watch

dev:
	npm run dev


##
# Running services together
##
run-all:
	docker-compose -f ./docker-compose.lewbank1.yml up

test-run-all:
	# Can we use a common docker-compose and branch off with custom settings and run multiple instances? Maybe
	docker-compose -f docker-compose.yml -f ./docker-compose.lewbank1.yml -p lewbank1 up -d
	docker-compose -f docker-compose.yml -f ./docker-compose.lewbank2.yml -p lewbank2 up -d