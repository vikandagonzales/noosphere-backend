const jwt = require('jsonwebtoken');
const model = require('../models/auth');

const login = (req, res, next) => {
  if (!req.body.first_name || !req.body.last_name) return next({status: 400, message: 'Missing information'});
  model.login(req.body)
    .then(({id, first_name, last_name, group_id, admin}) => {
      const token = jwt.sign({id, first_name, last_name, group_id, admin}, process.env.SECRET);
      return res.status(200).send({token});
    })
    .catch(next);
};

const isAuthenticated = (req, res, next) => {
  if (!req.headers.authorization) return next({status: 401, message: 'Unauthorized'});
  const [scheme, credentials] = req.headers.authorization.split(' ');
  jwt.verify(credentials, process.env.SECRET, (err, payload) => {
    if (err) return next({status: 401, message: 'Unauthorized'});
    req.claim = payload;
    next();
  });
};

const updateSelf = (req, res, next) => {
  model.updateSelf(req.claim.id)
    .then(self => {
      req.claim.first_name = self.first_name;
      req.claim.last_name = self.last_name;
      next();
    });
};

const getAuthStatus = (req, res, next) => {
  return res.status(200).send({...req.claim});
}

module.exports = {
  login,
  isAuthenticated,
  updateSelf,
  getAuthStatus
};