module.exports = function(adamite) {
  return function(req, res, next) {
    if (req.headers.authorization === `Bearer ${adamite.keys.getSecret()}`) {
      next();
    } else {
      res.status(401).end();
    }
  };
}