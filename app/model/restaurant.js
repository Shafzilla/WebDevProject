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

// ---------------- Basket ----------------

const getBasket = async (userId) => {
    const query = `
        SELECT 
            basket.id AS basket_id,
            basket.quantity,
            
            dishes.id AS dish_id,
            dishes.name AS dish_name,
            dishes.price AS dish_price,
            dishes.dish_url AS dish_image,

            restaurants.id AS restaurant_id,
            restaurants.name AS restaurant_name
        FROM basket
        JOIN dishes ON basket.dish_id = dishes.id
        JOIN restaurants ON dishes.restaurant_id = restaurants.id
        WHERE basket.user_id = $1 
    `;
    const result = await pool.query(query, [userId]); // change to [userId] after login is done
    return result.rows;
};



//adds to dishes to basket, increments quantity if dish already in basket
const addToBasket = async (userId, dishId) => {

    const query = `
        INSERT INTO basket (user_id, dish_id, quantity)
        VALUES ($1, $2, 1)
        ON CONFLICT (user_id, dish_id)
        DO UPDATE SET quantity = basket.quantity + 1
        RETURNING *;
    `;

    const result = await pool.query(query, [userId, dishId]);
    return result.rows[0];
};



//Delete basket item by removing whole row 
async function deleteBasketItem(basketId, userId) {
    const query = `
        DELETE FROM basket
        WHERE id = $1 AND user_id = $2
        RETURNING *;
    `;

    const result = await pool.query(query, [basketId, userId]);
    return result.rowCount > 0;
}


//edit quantity of selected dish in basket
const updateBasketQuantity = async (userId, dishId, change) => {
    //can add or minus a dish 
    const query = `
        UPDATE basket
        SET quantity = quantity + $1
        WHERE user_id = $2 AND dish_id = $3
        RETURNING *;
    `;
    
    const result = await pool.query(query, [change, userId, dishId]);
    //returns updated row
    return result.rows[0]; 
};


module.exports = {
    getAllRestaurants,
    getDishesByRestaurantId,
    getBasket,
    addToBasket,
    deleteBasketItem,
    updateBasketQuantity
};
