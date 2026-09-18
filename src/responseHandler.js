const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`)
const css = fs.readFileSync(`${__dirname}/../client/style.css`)

// unsafe but itll work
const formatJsonAsXML = (json) => {
  let xml = '<response>\n';
  xml += Object.entries(json).map(([k, v]) => `<${k}>${v}</${k}>`).join('\n')
  xml += '\n</response>'
  return xml
}

const respond = (request, response, content, contentType, statusCode = 200) => {
  response.writeHead(statusCode, { 'Content-Type': contentType })
  response.write(content);
  response.end()
}

const respondJsonOrXML = (request, response, contentJson, statusCode = 200) => {
  if (request.acceptedTypes && (request.acceptedTypes[0] === 'text/xml' || request.acceptedTypes[0] === 'application/xml')) {
    respond(request, response, formatJsonAsXML(contentJson), 'text/xml', statusCode)
    return
  }
  respond(request, response, JSON.stringify(contentJson), 'application/json', statusCode)
}

const getIndex = (request, response) => {
  respond(request, response, index, 'text/html')
}

const getCss = (request, response) => {
  respond(request, response, css, 'text/css')
}

const get404 = (request, response) => {
  let responseJSON = {
    message: "The page you are looking for was not found",
    id: "notFound"
  }
  respondJsonOrXML(request, response, responseJSON, 404)
}

const getSuccess = (request, response) => {
  let responseJSON = {
    message: "This is a successful response"
  }
  respondJsonOrXML(request, response, responseJSON)
}

const getForbidden = (request, response) => {
  let responseJSON = {
    message: "You do not have access to this content",
    id: "forbidden"
  }
  respondJsonOrXML(request, response, responseJSON, 403)
}

const getInternal = (request, response) => {
  let responseJSON = {
    message: "Internal Server Error. Something went wrong.",
    id: "internalError"
  }
  respondJsonOrXML(request, response, responseJSON, 500)
}

const getNotImplemented = (request, response) => {
  let responseJSON = {
    message: "A get request for this page has not been implemented yet. Check again later for any updated comment",
    id: "notImplemented"
  }
  respondJsonOrXML(request, response, responseJSON, 501)
}

const getBadRequest = (request, response) => {
  let responseJSON = {
    message: 'Missing valid query parameter set to true',
    id: 'badRequest'
  }
  let statusCode = 400;
  if (request.queryParams.get('valid') === 'true') {
    responseJSON = {
      message: 'The request has the required parameters',
    }
    statusCode = 200
  }
  respondJsonOrXML(request, response, responseJSON, statusCode)
}

const getUnauthorized = (request, response) => {
  let responseJSON = {
    message: 'Missing loggedIn query parameter set to yes',
    id: 'unauthorized'
  }
  let statusCode = 401;
  if (request.queryParams.get('loggedIn') === 'yes') {
    responseJSON = {
      message: 'You have successfully viewed the content',
    }
    statusCode = 200
  }
  respondJsonOrXML(request, response, responseJSON, statusCode)
}


module.exports = {
  getIndex,
  getCss,
  getSuccess,
  getForbidden,
  getInternal,
  getNotImplemented,
  getBadRequest,
  getUnauthorized,
  get404
}