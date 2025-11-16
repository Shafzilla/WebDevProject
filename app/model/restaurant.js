const pool = require('../config/database');

const getAllRestaurants = async() => {
    const result = await pool.query('SELECT id, name, image_url, cuisine_type, rating, address FROM restaurants ORDER BY id');
    return result.rows;
};


const getDishesByRestaurantId = async(restaurantId) => {

    const result = await pool.query(
        'SELECT id, name, description, price FROM dishes WHERE restaurant_id = $1 ORDER BY price desc', [restaurantId]
    );
    return result.rows;
};

const deleteRestaurant = async(restaurantId) => {

}



module.exports = {
    getAllRestaurants,
    getDishesByRestaurantId
};