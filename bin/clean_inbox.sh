#!/bin/bash

usage() {
   echo "usage: $0 [-n] [days]"
   echo "  -n    dry run, only list the files"
   echo "  days  defaults to VITE_MAX_NOTIFICATION_AGE or 30"
   exit 1
}

cd "$(dirname "$0")/.." || exit 2

if [ -f .env ]; then
   source .env
fi

DRYRUN=0

while getopts "n" opt; do
   case ${opt} in
      n) DRYRUN=1 ;;
      *) usage ;;
   esac
done
shift $((OPTIND - 1))

DAYS=${1:-${VITE_MAX_NOTIFICATION_AGE:-30}}

if ! [[ "${DAYS}" =~ ^[0-9]+$ ]]; then
   echo "days must be a number: '${DAYS}'"
   usage
fi

SAMPLES=$(git ls-files inbox)

if [ $? -ne 0 ]; then
   echo "can't list the sample files in inbox/ (not a git checkout?)"
   exit 2
fi

KEEP=()
while read -r f; do
   [ -n "${f}" ] && KEEP+=(! -name "${f##*/}")
done <<< "${SAMPLES}"

ACTION=(-delete)
[ ${DRYRUN} -eq 1 ] && ACTION=()

for dir in "${LDN_SERVER_INBOX_PATH:-./inbox}" "${LDN_SERVER_ERROR_PATH:-./error}" "${LDN_SERVER_OUTBOX_PATH:-./outbox}"; do
   if [ -d "${dir}" ]; then
      find "${dir}" -type f ! -name '.*' "${KEEP[@]}" -mmin +$((DAYS * 1440)) -print "${ACTION[@]}"
   fi
done
