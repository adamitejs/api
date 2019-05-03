const { Router } = require("express");
const basicAuth = require("express-basic-auth");
const secretAuth = require("../middleware/secretAuth");

module.exports = function(adamite) {
  const router = new Router();
  const requireBasicAuth = basicAuth({ users: adamite.keys.getAdminUsers() });
  const requireSecretAuth = secretAuth(adamite);

  router.get("/secret", requireBasicAuth, function(req, res) {
    res.status(200).end(adamite.keys.getSecret());
  });

  router.get("/", requireSecretAuth, function(req, res) {
    res.json(adamite.keys.getKeys());
  });

  router.get("/:key", function(req, res) {
    const key = adamite.keys.findKey(req.params.key, req.query.origin);
    if (!key) return res.status(404).end();
    res.json(key);
  });

  router.post("/", requireSecretAuth, function(req, res) {
    const newKey = adamite.keys.addKey(req.body.origins);
    res.json(newKey);
  });

  return router;
};
