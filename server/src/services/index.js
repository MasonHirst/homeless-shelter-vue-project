const users = require('./users/users.service.js');
const residents = require('./residents/residents.service.js');
const medications = require('./medications/medications.service.js');
const illnesses = require('./illnesses/illnesses.service.js');
const checkins = require('./checkins/checkins.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(residents);
  app.configure(medications);
  app.configure(illnesses);
  app.configure(checkins);
};
