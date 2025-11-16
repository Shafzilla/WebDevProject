const pool = require('../config/database');
const {listDishes} = require("../controller/api");

async function createUser(username, email, passwordHash){

    const queryText = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, email;
    `;
    const values = [username, email, passwordHash];

    const result = await pool.query(
        queryText,
        values
    );


}

module.exports = {
    createUser
};