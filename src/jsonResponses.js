const users = require('./users.js');

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getUsersGET = (request, response) => {
  respondJSON(request, response, 200, { users: users.getUsers() });
};

const getUsersHEAD = (request, response) => {
  respondJSONMeta(request, response, 200);
};

const notRealGET = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

const notRealHEAD = (request, response) => {
  respondJSONMeta(request, response, 404);
};

const addUserPOST = (request, response) => {
  let body = '';

  // Event listener for data chunks
  request.on('data', (chunk) => {
    body += chunk;
  });

  // Event listener for end of data
  request.on('end', () => {
    // Parse the body to get the user object
    const userObj = JSON.parse(body);
    const status = users.addUser(userObj);

    if (status === 400) {
      respondJSON(request, response, 400, {
        message: 'Name and age are both required',
        id: 'addUserMissingParams',
      });
    } else if (status === 204) {
      // There is no response body in a 204 message
      respondJSONMeta(request, response, 204);
    } else {
      respondJSON(request, response, 201, { message: 'Created successfully' });
    }
  });
};

const getNotFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

// Export handlers
module.exports = {
  getUsersGET,
  getUsersHEAD,
  notRealGET,
  notRealHEAD,
  addUserPOST,
  getNotFound,
};
