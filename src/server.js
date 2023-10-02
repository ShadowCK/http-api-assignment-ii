// Import modules
const http = require("http");
const url = require("url");
const query = require("querystring");
// Import scripts
const htmlHandler = require("./htmlResponses.js");
const jsonHandler = require("./jsonResponses.js");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  json: {
    GET: {
      "/success": jsonHandler.getSuccess,
      "/badRequest": jsonHandler.getBadRequest,
      "/unauthorized": jsonHandler.getUnauthorized,
      "/forbidden": jsonHandler.getForbidden,
      "/internal": jsonHandler.getInternal,
      "/notImplemented": jsonHandler.getNotImplemented,
    },
  },
  html: {
    GET: {
      "/": htmlHandler.getIndex,
      "/style.css": htmlHandler.getCSS,
    },
  },
  default: jsonHandler.getNotFound,
};

const MIMETypeToHandlerMapping = {
  "application/json": "json",
  "text/html": "html",
  "text/css": "html",
};

const onRequest = (request, response) => {
  // Parse the url into an object
  const parsedUrl = url.parse(request.url);
  // Grab useful data
  const { pathname } = parsedUrl;
  const params = query.parse(parsedUrl.query);

  // Check Accept header to determine response format, default to json
  const acceptHeader = request.headers.accept || "application/json";
  const acceptedTypes = acceptHeader.split(",");
  console.log("pathname", pathname);
  console.log("types", acceptedTypes);

  const method = request.method;

  let handler = null;
  for (let type of acceptedTypes.map((type) => MIMETypeToHandlerMapping[type] || type)) {
    // Invalid type
    if (!urlStruct[type]) {
      continue;
    }
    const handlerMap = urlStruct[type][method];
    // Invalid method
    if (!handlerMap) {
      continue;
    }
    let _handler = handlerMap[pathname];
    // Found handler
    if (_handler instanceof Function) {
      handler = _handler;
      break; // Bail out
    }
  }
  // Assign default handler
  if (!handler) {
    handler = urlStruct.default;
  }

  console.log("handler", handler);

  handler(request, response, params);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
