# Log Filter

> Filter sensitive parameters from log files

[![npm (scoped)](https://img.shields.io/npm/v/@dadi/log-filter.svg?maxAge=10800&style=flat-square)](https://www.npmjs.com/package/@dadi/log-filter)
[![Coverage Status](https://coveralls.io/repos/github/dadi/log-filter/badge.svg?branch=master)](https://coveralls.io/github/dadi/log-filter?branch=master)
[![Build Status](https://travis-ci.org/dadi/log-filter.svg?branch=master)](https://travis-ci.org/dadi/log-filter)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

## Install

```
npm i @dadi/log-filter
```

## Filter querystring parameters

```js
const LogFilter = require('@dadi/log-filter')

let req = {
  url: '/profile?username=ed&password=octopus'
}

let filter = ['password']

let logFilter = new LogFilter(req, filter)
let output = logFilter.filterPath()

// produces /profile?username=ed&password=%5BFILTERED%5D
```


