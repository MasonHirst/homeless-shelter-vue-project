// Initializes the `medications` service on path `/medications`
const { Medications } = require('./medications.class');
const createModel = require('../../models/medications.model');
const hooks = require('./medications.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/medications', new Medications(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('medications');

  service.hooks(hooks);
};
