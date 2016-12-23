#!/bin/bash

case "${TRAVIS_OS_NAME}" in
  osx)
    cd example_tmp
    set -o pipefail && npm run build:ios | xcpretty -c -f `xcpretty-travis-formatter`
    npm run test:ios
    cd ../
    npm test
  ;;
  linux)
    cd example_tmp
    npm run build:android
    npm run test:android
    cd ../
    npm test
  ;;
esac