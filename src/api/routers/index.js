const keys = require('./keys');

module.exports = function(app, arc) {
  app.use('/api/keys', keys(arc));
};