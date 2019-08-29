

build:
	docker-compose build
	# Tag other images to save time - they are all based on the same thing!
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
start:
	# Use the -p flag to run multiple docker composes at once
	docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank1.yml -p lewbank1 up -d
	# docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank2.yml -p lewbank2 up -d

stop:
	docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank1.yml -p lewbank1 stop
	docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank2.yml -p lewbank2 stop

logs-lewbank1:
	docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank1.yml -p lewbank1 logs -f custom-dfsp scheme-adapter 

logs-lewbank2:
	docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank2.yml -p lewbank2 logs -f custom-dfsp scheme-adapter

lt-lewbank1:
	lt -s lewbank1_a -p 4000

lt-lewbank2:
	lt -s lewbank2_a -p 4100
