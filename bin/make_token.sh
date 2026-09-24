#!/bin/bash

source .env

if [ "${RELAY_TOKEN_DIR}" == "" ]; then
   echo "no RELAY_TOKEN_DIR defined"
   exit 1
fi

if [ ! -d ${RELAY_TOKEN_DIR} ]; then
   echo "no '${RELAY_TOKEN_DIR}' directory exists"
   exit 2
fi

echo -n "To: "
read ans

RAND=$(openssl rand -hex 16)

printf "To: $ans\n" > ${RELAY_TOKEN_DIR}/${RAND}

echo "created ${RELAY_TOKEN_DIR}/${RAND}"
