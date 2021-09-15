#!/bin/bash
cat ./dockerkey.txt\
    | docker login --username rscolati --password-stdin
docker pull rscolati/subify:latest
docker stop subify
docker rm subify
docker run --name subify -d -p 8082:8080\
    --restart unless-stopped rscolati/subify:latest