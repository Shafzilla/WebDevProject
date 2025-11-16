const pool = require('../config/database');


async function createUser(username, email, passwordHash){

    const queryText = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, email;
    `;
    const values = [username, email, passwordHash];

    await pool.query(
        queryText,
        values
    );


}


async function getUserByUsername(username){

    const queryText = `
        SELECT id, username, email, password_hash FROM users WHERE username = $1;
    
    `;
    const values = [username];

    const result = await pool.query(queryText, values);

    return result.rows[0] || null;
}


module.exports = {
    createUser,
    getUserByUsername
};