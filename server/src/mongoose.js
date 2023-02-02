const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = function (app) {
  let url = app.get('mongodb') === 'MONGO_URL' ? 'mongodb://mongoadmin:secret@localhost:27017' : app.get('mongodb');
  mongoose.connect(url)
    .then(() => {
      console.log('successfully connected to mongodb URL: ' + url);
    })
    .catch(err => {
      logger.error(err);
      process.exit(1);
    });


  app.set('mongooseClient', mongoose);
};
