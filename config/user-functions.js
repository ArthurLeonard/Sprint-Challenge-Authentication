
const db = require('../database/dbConfig.js');

module.exports = {
    addUser,
    findUser,
    findUserBy,
    findUserByID
};


function findUser () {
    return db('users').select('id', 'username', 'password', 'department');    // runs appropriate SQL commands
}

function findUserBy ( filter ) {
    return db('users').where(filter);                // runs appropriate SQL commands
} 

function findUserByID ( id ) {
    return db('users').where({ id }).first();
}

async function addUser (user) {
    const [id] = await db('users').insert(user);
    return findUserByID(id);
}