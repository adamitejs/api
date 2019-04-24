const { Router } = require('express');
const basicAuth = require('express-basic-auth');
const secretAuth = require('../middleware/secretAuth');

module.exports = function(arc) {
  const router = new Router();
  const requireBasicAuth = basicAuth({ users: arc.keys.getAdminUsers() });
  const requireSecretAuth = secretAuth(arc);

  router.get(
    '/secret',
    requireBasicAuth,
    function (req, res) {
      res.status(200).end(arc.keys.getSecret());
    }
  );

  router.get(
    '/',
    requireSecretAuth,
    function (req, res) {
      res.json(arc.keys.getKeys());
    }
  );
  
  router.get(
    '/:key',
    function (req, res) {
      const key = arc.keys.findKey(req.params.key, req.query.origin);
      if (!key) return res.status(404).end();
      res.json(key);
    }
  );

  router.post(
    '/',
    requireSecretAuth,
    function (req, res) {
      const newKey = arc.keys.addKey(req.body.origins);
      res.json(newKey);
    }
  );

  return router;
};