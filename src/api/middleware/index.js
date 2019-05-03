const cors = require("cors");
const bodyParser = require("body-parser");
const slowDown = require("express-slow-down");

module.exports = function(app) {
  // app.use(slowDown({
  //   windowMs: 5 * 60 * 1000, // 5 minute
  //   delayAfter: 250, // allow 250 requests at full speed, then...
  //   delayMs: 100, // 251st request has a 500ms delay, and 500ms for each request after.
  //   maxDelayMs: 2000 // delay should never be higher than 2 seconds
  // }));

  app.use(cors());
  app.use(bodyParser.json());
};
