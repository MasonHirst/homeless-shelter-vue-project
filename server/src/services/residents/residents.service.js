// Initializes the `residents` service on path `/residents`
const { Residents } = require('./residents.class');
const createModel = require('../../models/residents.model');
const hooks = require('./residents.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/residents', new Residents(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('residents');

  service.hooks(hooks);
};
