const db = require('../../db');

const getAll = () => {
  return db('guests');
};

const getOne = id => {
  return db('guests')
    .where({id: id})
    .first();
};

const getOneByName = (first_name, last_name) => {
  return db('guests')
    .where({first_name: first_name, last_name: last_name})
    .first();
};

const create = async ({group_id, first_name, last_name, plus_one}) => {
  const allGuests = await getAll();
  const duplicate = await allGuests.find(guest => guest.first_name === first_name && guest.last_name === last_name);
  const guests = await allGuests.filter(guest => guest.group_id == group_id);
  const group = await groupsModel.getOne(group_id);
  if (guests.length >= group.limit) throw {status: 400, message: 'Limit for group exceeded'};
  if (duplicate) throw {status: 400, message: 'Guest already exists'};
  return db('guests')
    .insert({group_id, first_name, last_name, plus_one})
    .returning('*')
    .then(([data]) => {
      return data;
    });
};

const update = async (id, {first_name, last_name, accepted, plus_one, admin}) => {
  const guest = await getOne(id);
  const allGuests = await getAll();
  const duplicate = await allGuests.find(guest => guest.first_name === first_name && guest.last_name === last_name);
  if (duplicate && duplicate.id !== guest.id) throw {status: 400, message: 'Guest already exists'};
  const updated = {};
  first_name ? updated.first_name = first_name : null;
  last_name ? updated.last_name = last_name : null;
  accepted || accepted === false || accepted === null ? updated.accepted = accepted : null;
  plus_one || plus_one === false ? updated.plus_one = plus_one : null;
  admin || admin === false ? updated.admin = admin : null;
  return db('guests')
    .update(updated)
    .where({id: id})
    .returning('*')
    .then(([data]) => {
      return data;
    });
};

const remove = id => {
  return db('guests')
    .del()
    .where({id: id})
    .returning('*')
    .then(([data]) => {
      delete data.id;
      return data;
    });
};

module.exports = {
  getAll,
  getOne,
  getOneByName,
  create,
  update,
  remove
};