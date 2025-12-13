
const { getAllRestaurants, getDishesByRestaurantId, getDishesByFoodType, getBasket, addToBasket, deleteBasketItem, updateBasketQuantity} = require('../model/restaurant');
const { createUser, getUserByUsername} = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const jwtExpirySeconds = 300


// ---------------- Restaurants ----------------


// puts restaurants data into json response
const listRestaurants = async(req, res) => {
    try {
        const restaurants = await getAllRestaurants();
        res.json(restaurants);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error listing restaurants');
    }
};

// puts dishes by restaurantID into json response
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

// puts dishes by food type into JSON response
const listDishesByFoodType = async(req, res) => {
    const foodType = req.params.foodType;
    try {
        const dishes = await getDishesByFoodType(foodType);
        res.json(dishes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error fetching dishes by food type');
    }
};



// puts information into json
async function signUp(req, res) {

    const { username, email, password } = req.body;

    // if theres no email or password then error
    if (!email || !password) {

        return res.status(400).send('Email and password required');

    }

    // hashes password
    const passwordHash = await bcrypt.hash(password, 10);

    // calls sql query with parameters
    await createUser(username, email, passwordHash);

    return res.status(200).json({

        message: 'User signed up',

    });

}

// checks login details
async function login(req, res) {

    const { username, password } = req.body;

    // calls SQL query to get user details
    const user = await getUserByUsername(username)

    // if theres no user then error
    if (!user) {

        return res.status(401).send('User does not exist');

    }

    // compares login attempt password with hashed password in DB
    const checkPassword = await bcrypt.compare(password, user.password_hash);

    // if password check is unsuccessful then error
    if (!checkPassword) {

        return res.status(401).send('User does not exist');

    }

    // window.location.href = "/";

    // payload for jwt
    const payload = {

        id: user.id,
        username: user.username

    }

    // creates jwt
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: jwtExpirySeconds, algorithm: 'HS256'});

    // creates cookie
    res.cookie('token', token, {

        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: jwtExpirySeconds * 1000,
        sameSite: 'lax'
    });


    // returns success response
    return res.status(200).json({

        message: 'login successfull',
        userId: user.id,
        username: user.username,

    })

}

// checks if token in cookie is legitimate
const authenticateToken = (req, res, next) => {

    const token = req.cookies.token;

    // if no token then error
    if (!token) {

        return res.status(401).send('No token provided');

    }

    try {

        //checks if token is valid
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

// returns user id and username in JSON response
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
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const basket = await getBasket(userId);
        res.json(basket);
    } 
    catch (err) {
        console.error("Error in listBasket:", err);
        console.error("Error stack:", err.stack);
        res.status(500).json({ 
            error: "Error fetching basket",
            message: err.message 
        });
    }
};


const createBasketItem = async (req, res) => {
    try {
        const { dish_id } = req.body;
        const userId = req.user.id;

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
    const userId = req.user.id; // TEMP for now

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
        const userId = req.user.id;

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
    listDishesByFoodType,
    login,
    authenticateToken,
    getUserDetails,
    listBasket,
    createBasketItem,
    removeBasketItem,
    changeBasketQuantity,
    signUp,
};

