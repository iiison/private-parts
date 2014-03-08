all: install test test-browser

install:
	@ npm install

jshint:
	@ jshint *.js lib/*.js test/*.js

	# Start node with the harmony flag turned on
	# to run the tests in a native WeakMap environment.
test: jshint
	@ node --harmony node_modules/.bin/tape test/*.js

# Run the tests in a headless browser using a
# testling and a WeakMap shim.
test-browser:
	@ node node_modules/.bin/testling

.PHONY: all install jshint test test-browser
