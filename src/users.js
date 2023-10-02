const users = {};

const getUsers = () => users;

const addUser = (userObj) => {
  const { name, age } = userObj;

  // Invalid or missing parameters
  if (!name || !age) {
    return 400;
  }

  // Updates the user's age if the user exists
  if (users[name]) {
    users[name].age = age;
    return 204;
  }

  // Creates a new user
  users[name] = { name, age };
  return 201;
};

module.exports = {
  getUsers,
  addUser,
};
