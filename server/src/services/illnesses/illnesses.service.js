// Initializes the `illnesses` service on path `/illnesses`
const { Illnesses } = require('./illnesses.class');
const createModel = require('../../models/illnesses.model');
const hooks = require('./illnesses.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/illnesses', new Illnesses(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('illnesses');

  service.hooks(hooks);
};
