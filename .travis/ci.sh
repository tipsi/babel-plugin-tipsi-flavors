#!/bin/bash

FLAVORS=custom,tipsi npm test
cd example_tmp

case "${TRAVIS_OS_NAME}" in
  osx)
    set -o pipefail && FLAVORS=custom,tipsi npm run build:ios | xcpretty -c -f `xcpretty-travis-formatter`
    npm run test:ios
  ;;
  linux)
    FLAVORS=custom,tipsi npm run build:android
    npm run test:android
  ;;
esac
