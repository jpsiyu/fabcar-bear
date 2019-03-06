#!/bin/bash

docker rm -f $(docker ps -aq)
rm -rf ./server/wallet