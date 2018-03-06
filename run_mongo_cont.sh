#!/usr/bin/env bash

if [[ "$(docker ps -a | grep some-mysql 2> /dev/null)" != "" ]]; then
  docker rm -f some-mongo
fi

docker run --name some-mongo -d -p 27017:27017 mongo:3.6