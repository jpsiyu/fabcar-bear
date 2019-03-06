#!/bin/bash

docker rmi -f $(docker images | grep fabcar | awk '{print $3}')