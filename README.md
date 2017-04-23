# Transactions uploader and converter
For a given file and currency input, display in a table 5 days from the previous 30 day period that would yield the biggest amount of currency

## Installation

For building and using file-currency-converter, node.js is required

    # install latest node.js package manager
    npm install -g npm

    # install n package manager
    npm install -g n

    # install node 7.9.0
    n 7.9.0

Install file-currency-converter dependencies

    npm install
    npm install sqlite3

## Running

    npm start

    # show all flags
    npm start -- --help

    # start the server without clearing the database
    npm start -- --db-sync=false

    # start server with debug logs
    npm start -- --debug

## Upload and convert

After starting the server open browser and visit 'http://127.0.0.1:38000/'

## Tests

    # run from file-currency-converter directory
    ./tests/run_tests.sh
