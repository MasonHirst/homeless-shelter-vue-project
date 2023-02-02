const users = require('./users/users.service.js');
const residents = require('./residents/residents.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(residents);
};
