
REPO:=ldaly
VER:=$(shell ./config/_get_version.js )
NAME_FSP:=sheet-fsp
NAME_SCHEME_ADAPTER:=sdk-scheme-adapter
TAG_FSP=${REPO}/${NAME_FSP}:${VER}
TAG_SCHEME_ADAPTER:=${REPO}/${NAME_SCHEME_ADAPTER}:${VER}


build:
	docker-compose build
	# Tag other images to save time - they are all based on the same thing!
	docker tag sheet-fsp_sheet-fsp:latest lewbank1_sheet-fsp:latest
	docker tag sheet-fsp_scheme-adapter:latest lewbank1_scheme-adapter:latest
	docker tag sheet-fsp_sheet-fsp:latest lewbank2_sheet-fsp:latest
	docker tag sheet-fsp_scheme-adapter:latest lewbank2_scheme-adapter:latest

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
	docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank2.yml -p lewbank2 up -d

stop:
	docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank1.yml -p lewbank1 stop
	docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank2.yml -p lewbank2 stop

logs-lewbank1:
	docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank1.yml -p lewbank1 logs -f sheet-fsp scheme-adapter 

logs-lewbank2:
	docker-compose -f docker-compose.yml -f ./config/docker-compose.lewbank2.yml -p lewbank2 logs -f sheet-fsp scheme-adapter

lt-lewbank1:
	lt -s lewbank1_a -p 4000

lt-lewbank2:
	lt -s lewbank2_a -p 4100


##
# Package & Deploy
##
package:
	REPO=${REPO} VER=${VER} docker-compose build
	docker push ${TAG_FSP}
	docker push ${TAG_SCHEME_ADAPTER}

deploy:
	# TODO: find a way to pass in ver
	# I want to try using kubernetes WITHOUT using Helm
	kubectl apply configmap lewbank1-scheme-adapter-config --from-file=./deployment/lewbank1.scheme-adapter.config.yaml || echo 'already created configmap'
	kubectl apply -f ./deployment

destroy:
	# kubens mojaloop
	kubectl delete deployment lewbank1-deployment
	# kubectl delete service lewbank1-service
	# kubectl delete po lewbank1
	kubectl delete configmap lewbank1-scheme-adapter-config