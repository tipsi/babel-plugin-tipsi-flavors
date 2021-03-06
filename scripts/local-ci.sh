#!/bin/bash

set -e

if [[ $@ == *"--skip-new"* ]]; then
  skip_new=true
else
  skip_new=false
fi

if [[ $@ == *"--use-old"* ]]; then
  use_old=true
else
  use_old=false
fi

proj_dir_old=example
proj_dir_new=example_tmp

react_native_version=$(cat $proj_dir_old/package.json | sed -n 's/"react-native": "\(\^|~\)*\(.*\)",*/\2/p')
library_name=$(node -p "require('./package.json').name")

files_to_copy=(
  package.json
  .babelrc
  .appiumhelperrc
  index.{ios,android}.js
  android/app/build.gradle
  src
  scripts
  __tests__
)

isMacOS() {
  [ "$(uname)" == "Darwin" ]
}

###################
# BEFORE INSTALL  #
###################
npm i
npm test
npm run run:emulator:android

# Check is macOS
! isMacOS && echo "Current os is not macOS, setup for iOS will be skipped"
# Install react-native-cli if not exist
if ! type react-native > /dev/null; then
  npm install -g react-native-cli
fi

if ($skip_new && ! $use_old); then
  echo "Creating new example project skipped"
  # Go to new test project
  cd $proj_dir_new
elif (! $skip_new && ! $use_old); then
  # Remove react-native to avoid affecting react-native init
  rm -rf node_modules/react-native
  echo "Creating new example project"
  # Remove old test project and tmp dir if exist
  rm -rf $proj_dir_new tmp
  # Init new test project in tmp directory
  mkdir tmp
  cd tmp
  react-native init $proj_dir_old --version $react_native_version
  # Move new project from tmp dir and remove tmp dir
  cd ..
  mv tmp/$proj_dir_old $proj_dir_new
  rm -rf tmp
  # Remove default __tests__ folder from new project directory
  rm -rf $proj_dir_new/__tests__
  # Copy necessary files from example project
  for i in ${files_to_copy[@]}; do
    if [ -e $proj_dir_old/$i ]; then
      cp -Rp $proj_dir_old/$i $proj_dir_new/$i
    fi
  done
  # Go to new test project
  cd $proj_dir_new
else
  echo "Using example folder for tests"
  # Go to old test project
  cd $proj_dir_old
fi

###################
# INSTALL         #
###################

# Install dependencies
npm install

###################
# BEFORE BUILD    #
###################

# Run appium
appiumPID=$(ps -A | grep -v grep | grep appium | awk '{print $1}')
if [ -z $appiumPID ]; then
  npm run appium > /dev/null 2>&1 &
else
  echo "appium is already running, restart appium"
  kill -9 $appiumPID
  npm run appium > /dev/null 2>&1 &
fi

###################
# BUILD           #
###################

# Build Android app
npm run build:android
# Build iOS app
isMacOS && npm run build:ios

###################
# TESTS           #
###################

# Run Android e2e tests
npm run test:android
# Run iOS e2e tests
if isMacOS; then
  npm run test:ios
fi
