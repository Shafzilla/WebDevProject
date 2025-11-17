const pool = require('../config/database');

const getBasket = async (userId) => {
    const query = `
        SELECT 
            basket.id AS basket_id,
            basket.quantity,
            
            dishes.id AS dish_id,
            dishes.name AS dish_name,
            dishes.price AS dish_price,

            restaurants.id AS restaurant_id,
            restaurants.name AS restaurant_name,
            restaurants.image_url AS restaurant_image
        FROM basket
        JOIN dishes ON basket.dish_id = dishes.id
        JOIN restaurants ON dishes.restaurant_id = restaurants.id
        WHERE basket.user_id = $1
    `;
    const result = await pool.query(query, [1]); // change to [userId] after login is done
    return result.rows;
};


const addToBasket = async (userId, dishId, quantity) => {
    const query = `
        INSERT INTO basket (user_id, dish_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await pool.query(query, [userId, dishId, quantity]);
    return result.rows[0];
};


module.exports = {
    getBasket,
    addToBasket
};
