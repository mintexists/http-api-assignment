const http = require('http');
const responseHandler = require('./responseHandler.js')

const port = process.env.PORT || process.env.NODE_PORT || 3000

const urlStruct = {
  "/": responseHandler.getIndex,
  "/style.css": responseHandler.getCss,
  "/success": responseHandler.getSuccess,
  "/forbidden": responseHandler.getForbidden,
  "/internal": responseHandler.getInternal,
  "/notImplemented": responseHandler.getNotImplemented,
  "/badRequest": responseHandler.getBadRequest,
  "/unauthorized": responseHandler.getUnauthorized,
  default: responseHandler.get404
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http'
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  if(request.headers.accept) {
    request.acceptedTypes = request.headers.accept.split(',');
  }

  request.queryParams = parsedUrl.searchParams

  const handler = urlStruct[parsedUrl.pathname]

  if (handler) {
    handler(request, response)
  } else {
    urlStruct.default(request, response)
  }
}

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
})