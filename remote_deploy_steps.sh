#!/usr/bin/env bash
set -euox pipefail

cd wedding-site

docker-compose -f docker-compose.yml -f docker-compose-prod.yml build
docker stop $(docker ps -a | grep -v postgres | awk 'NR>1 {print $1}')
docker rm $(docker ps -a | grep -v postgres | awk 'NR>1 {print $1}')
docker-compose -f docker-compose.yml -f docker-compose-prod.yml up -d
