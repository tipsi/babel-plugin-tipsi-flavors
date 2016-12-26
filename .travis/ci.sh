#!/bin/bash

case "${TRAVIS_OS_NAME}" in
  osx)
    npm test
    cd example_tmp
    set -o pipefail && FLAVORS=custom,tipsi npm run build:ios | xcpretty -c -f `xcpretty-travis-formatter`
    npm run test:ios
    cd ../
  ;;
  linux)
    npm test
    cd example_tmp
    FLAVORS=custom,tipsi npm run build:android
    npm run test:android
    cd ../
  ;;
esac
