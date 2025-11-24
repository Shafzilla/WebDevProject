
const { getAllRestaurants, getDishesByRestaurantId, getBasket, addToBasket, deleteBasketItem, updateBasketQuantity} = require('../model/restaurant');
const { createUser, getUserByUsername} = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';



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




async function signUp(req, res) {

    const { username, email, password } = req.body;

    if (!email || !password) {

        return res.status(400).send('Email and password required');

    }

    const passwordHash = await bcrypt.hash(password, 10);

    await createUser(username, email, passwordHash);

    return res.status(200).json({

        message: 'User signed up',

    });

}

async function login(req, res) {

    const { username, password } = req.body;

    const user = await getUserByUsername(username)

    if (!user) {

        return res.status(401).send('User does not exist');

    }

    const checkPassword = await bcrypt.compare(password, user.password_hash);

    if (!checkPassword) {

        return res.status(401).send('User does not exist');

    }

    // window.location.href = "/";

    const payload = {

        id: user.id,
        username: user.username

    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});

    res.cookie('token', token, {

        httpOnly: true,
        secure: process.env.NODE_ENV !== 'production',
        maxAge: 3600000
    });



    return res.status(200).json({

        message: 'login successfull',
        userId: user.id,
        username: user.username,

    })

}

const authenticateToken = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {

        return res.status(401).send('No token provided');

    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        next();

    }
    catch (err) {

        console.error("JWT veritifaction error", err);

        res.clearCookie('token');
        return res.status(403).send('invalid token');

    }

};

const getUserDetails = (req, res) => {

    if (req.user) {

        return res.json({
            id: req.user.id,
            username: req.user.username,

        })

    }

    res.status(401).send('Not authenticated');

}

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
    login,
    authenticateToken,
    getUserDetails,
    listBasket,
    createBasketItem,
    removeBasketItem,
    changeBasketQuantity,
    signUp,
};

