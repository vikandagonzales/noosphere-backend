const db = require('../../db');
const guestsModel = require('./users');

const login = ({first_name, last_name}) => {
  return guestsModel.getOneByName(first_name, last_name)
    .then(guest => {
      if (!guest) throw {status: 400, message: 'Guest not found'};
      if (guest.plus_one) throw {status: 400, message: 'Only invited guests can log in'};
      return guest;
    });
};

const updateSelf = id => {
  return guestsModel.getOne(id);
};

module.exports = {
  login,
  updateSelf
};