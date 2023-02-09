// Initializes the `checkins` service on path `/checkins`
const { Checkins } = require('./checkins.class');
const createModel = require('../../models/checkins.model');
const hooks = require('./checkins.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/checkins', new Checkins(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('checkins');

  service.hooks(hooks);
};
