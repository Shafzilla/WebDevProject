const { getAllRestaurants, getDishesByRestaurantId } = require('../model/restaurant');
const { getBasket, addToBasket } = require('../../model/basketModel');


// ---------------- Restaurants ----------------

const listRestaurants = async(req, res) => {
    try {
        const restaurants = await getAllRestaurants();
        res.json(restaurants);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error listing restaurants');
    }
};


const listDishes = async(req, res) => {
    const restaurantId = req.params.id;
    try {
        const dishes = await getDishesByRestaurantId(restaurantId);
        res.json(dishes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error fetching dishes');
    }
};




// ---------------- Basket ----------------

const listBasket = async (req, res) => {
    try {
        const userId = 1; // TEMPORARY until login works
        const basket = await getBasket(userId);
        res.json(basket);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching basket");
    }
};

const createBasketItem = async (req, res) => {
    try {
        const { dish_id, quantity } = req.body;
        const userId = 1; // TEMPORARY

        const item = await addToBasket(userId, dish_id, quantity);

        res.status(201).json({
            message: "Dish added to basket",
            item
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
    listRestaurants,
    listDishes,
    listBasket,
    createBasketItem
};