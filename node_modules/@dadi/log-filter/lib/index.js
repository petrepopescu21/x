const querystring = require('querystring')
const url = require('url')

class LogFilter {
  constructor (req, filter) {
    this.req = req
    this.filter = filter
  }

  // filterRequestParameters () {

  // }

  // filterEnvironment () {

  // }

  // Reconstructs a path with all sensitive GET parameters replaced.
  filterPath () {
    if (this.req.url.indexOf('?') < 0) {
      return this.req.url
    }

    let parsedUrl = url.parse(this.req.url, true)

    let searchParams = parsedUrl.query

    this.filter.forEach(key => {
      if (searchParams[key]) {
        searchParams[key] = '[FILTERED]'
      }
    })

    return `${parsedUrl.pathname}?${querystring.encode(searchParams)}`
  }
}

module.exports = LogFilter
