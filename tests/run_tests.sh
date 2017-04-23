#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR

../node_modules/jasmine-node/bin/jasmine-node --junitreport --verbose .
