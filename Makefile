

build:
	docker-compose -f ./docker-compose.lewbank1.yml build

watch:
	npm run watch

dev:
	npm run dev


##
# Running services together
##
run-all:
	docker-compose -f ./docker-compose.lewbank1.yml up