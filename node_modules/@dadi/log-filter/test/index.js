const http = require('http')
const LogFilter = require('../lib')
const should = require('should')

let logFilter

/*
 * Generate a Mock httpServer Request and Response
 * @PARAM statusCode - a RFC2616 status code
 * @PARAM forwarded - A boolean on whether or not to use the x-forwarded-for header, as if behind an ELB
 * @PARAM ip - The ip to insert into the request
 * @PARAM url - the url/path
 */
function generateMockRequestAndResponse (statusCode, forwarded, ip, url) {
  let req = {
    connection: {
      remoteAddress: ip || '8.8.8.8'
    },
    headers: {
      host: '0.0.0.0',
      referer: 'http://google.com',
      'user-agent':
        'Mozilla/5.0 (Windows NT x.y; WOW64; rv:10.0) Gecko/20100101 Firefox/10.0'
    },
    httpVersion: '1.1',
    method: 'GET',
    url: url || '/test',
    path: url || '/test'
  }

  if (forwarded) {
    req.connection.remoteAddress = '8.8.4.4'
    req.headers['x-forwarded-for'] = ip || '8.8.8.8'
  }

  let res = new http.ServerResponse(req)
  res.statusCode = statusCode || 200
  res.setHeader('content-length', 305)

  return {
    res: res,
    req: req,
    next: function () {
      res.end()
    }
  }
}

describe('Filtered parameters', function () {
  it('should leave path as is when there is no querystring', function (done) {
    let testHttp = generateMockRequestAndResponse()

    testHttp.req.url = '/'

    logFilter = new LogFilter(testHttp.req, ['password'])

    let output = logFilter.filterPath()

    output.should.eql(testHttp.req.url)

    done()
  })

  it('should remove sensitive parameters from querystring', function (done) {
    let testHttp = generateMockRequestAndResponse()
    testHttp.req.url = testHttp.req.url + '?username=ed&password=octopus'

    logFilter = new LogFilter(testHttp.req, ['password'])

    let output = logFilter.filterPath()

    let idx = output.indexOf('octopus')
    idx.should.eql(-1)

    done()
  })

  it('should not remove unspecified parameters from querystring', function (done) {
    let testHttp = generateMockRequestAndResponse()
    testHttp.req.url = testHttp.req.url + '?username=ed&password=octopus'

    logFilter = new LogFilter(testHttp.req, [])

    let output = logFilter.filterPath()

    let idx = output.indexOf('octopus')
    idx.should.not.eql(-1)

    done()
  })
})
