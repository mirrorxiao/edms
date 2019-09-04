#!/bin/bash

DIR=project

npm run build

wait

rsync -r --exclude node_modules . fe@193.112.97.65:$DIR