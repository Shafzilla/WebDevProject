const pool = require('../config/database');

// query to get all restaurants from restaurants table
const getAllRestaurants = async() => {
    const result = await pool.query('SELECT id, name, image_url, cuisine_type, rating, address FROM restaurants ORDER BY id');
    return result.rows;
};

// query to get all dishes with specific restaurantId
const getDishesByRestaurantId = async(restaurantId) => {

    const result = await pool.query(
        'SELECT id, name, description, price, image_url FROM dishes WHERE restaurant_id = $1 ORDER BY price desc', [restaurantId]
    );
    return result.rows;
};

// query to get all dishes with specific food type
const getDishesByFoodType = async(foodType) => {
    const query = `
        SELECT 
            dishes.id,
            dishes.name,
            dishes.description,
            dishes.price,
            dishes.image_url,
            dishes.restaurant_id,
            restaurants.name AS restaurant_name,
            restaurants.image_url AS restaurant_image
        FROM dishes
        JOIN restaurants ON dishes.restaurant_id = restaurants.id
        WHERE LOWER(dishes.description) LIKE $1 
           OR LOWER(dishes.name) LIKE $1
           OR LOWER(restaurants.cuisine_type) LIKE $1
        ORDER BY dishes.price DESC
    `;
    const searchTerm = `%${foodType.toLowerCase()}%`;
    const result = await pool.query(query, [searchTerm]);
    return result.rows;
};

const deleteRestaurant = async(restaurantId) => {

}

// ---------------- Basket ----------------

const getBasket = async (userId) => {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }
        
        const query = `
            SELECT 
                basket.id AS basket_id,
                basket.quantity,
                
                dishes.id AS dish_id,
                dishes.name AS dish_name,
                dishes.price AS dish_price,
                dishes.image_url AS dish_image,

                restaurants.id AS restaurant_id,
                restaurants.name AS restaurant_name
            FROM basket
            INNER JOIN dishes ON basket.dish_id = dishes.id
            INNER JOIN restaurants ON dishes.restaurant_id = restaurants.id
            WHERE basket.user_id = $1 
            ORDER BY basket.id DESC
        `;
        
        console.log("Executing getBasket query for userId:", userId);
        const result = await pool.query(query, [userId]);
        console.log("Basket query returned", result.rows.length, "items");
        return result.rows;
    } catch (error) {
        console.error("Database error in getBasket:", error);
        console.error("Error details:", {
            message: error.message,
            code: error.code,
            detail: error.detail
        });
        throw error;
    }
};



//adds dishes to basket, increments quantity if dish already in basket
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
    getDishesByFoodType,
    getBasket,
    addToBasket,
    deleteBasketItem,
    updateBasketQuantity
};
