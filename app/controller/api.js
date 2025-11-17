<<<<<<< Updated upstream
const { getAllRestaurants, getDishesByRestaurantId } = require('../model/restaurant');
=======
const { getAllRestaurants,
        getDishesByRestaurantId, 
        getBasket, 
        addToBasket, 
        deleteBasketItem,
        updateBasketQuantity
    } = require('../model/restaurant');



// ---------------- Restaurants ----------------
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
module.exports = {
    listRestaurants,
    listDishes
=======



// ---------------- Basket ----------------

const listBasket = async (req, res) => {
    try {
        const userId = 1; // TEMPORARY until login works
        const basket = await getBasket(userId);
        res.json(basket);
    } 
    catch (err) {
        console.error(err);
        res.status(500).send("Error fetching basket");
    }
};


const createBasketItem = async (req, res) => {
    try {
        const { dish_id } = req.body;
        const userId = 1; // temp until login created

        const item = await addToBasket(userId, dish_id);

        res.status(201).json({
            message: "Dish added to basket",
            item
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};



const removeBasketItem = async (req, res) => {
  try {
    const basketId = req.params.id;
    const userId = 1; // TEMP for now

    const success = await deleteBasketItem(basketId, userId);

    if (!success) {
      return res.status(404).json({ error: 'Item not found or not yours' });
    }

    res.json({ message: 'Removed' });
  } catch (err) {
    console.error('removeBasketItem error:', err);
    res.status(500).json({ error: err.message });
  }
};




const changeBasketQuantity = async (req, res) => {
    try {
        const userId = 1; // TEMPORARY until login works
        const dishId = parseInt(req.params.dishId);
        //{ change: 1 } or { change: -1 }
        const { change } = req.body; 

        if (![-1, 1].includes(change)) {
            return res.status(400).json({ error: "Invalid change value" });
        }

        const updated = await updateBasketQuantity(userId, dishId, change);

        if (!updated) {
            return res.status(404).json({ error: "Item not found in basket" });
        }

        //remove item if quantity  less or equal to 0
        if (updated.quantity <= 0) {
            await pool.query('DELETE FROM basket WHERE id = $1', [updated.id]);
            return res.json({ message: "Item removed from basket" });
        }

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update basket" });
    }
};




module.exports = {
    listRestaurants,
    listDishes,
    listBasket,
    createBasketItem,
    removeBasketItem,
    changeBasketQuantity
>>>>>>> Stashed changes
};