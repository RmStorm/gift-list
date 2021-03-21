#!/usr/bin/env bash
set -euox pipefail

SRC=/home/rmstorm/Documents/wedding-site/wedding-site/
DST=157.90.124.255:wedding-site

rsync -rzP --delete --filter=":- .gitignore" --exclude='.git' --exclude='/secrets/' $SRC $DST
ssh 157.90.124.255 'bash -s' < ./remote_deploy_steps.sh
