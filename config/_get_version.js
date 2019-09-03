#!/usr/bin/env node

/* A command line utility to easily get the version of the package for Make */

const {version} = require('../package.json')
console.log(version)