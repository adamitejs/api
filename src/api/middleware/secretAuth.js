module.exports = function(arc) {
  return function(req, res, next) {
    if (req.headers.authorization === `Bearer ${arc.keys.getSecret()}`) {
      next();
    } else {
      res.status(401).end();
    }
  };
}