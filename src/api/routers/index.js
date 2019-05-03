const keys = require("./keys");

module.exports = function(app, adamite) {
  app.use("/api/keys", keys(adamite));
};
