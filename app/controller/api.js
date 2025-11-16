const { getAllRestaurants, getDishesByRestaurantId } = require('../model/restaurant');
const { createUser, getUserByUsername} = require('../model/users');
const bcrypt = require('bcrypt');


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

        return res.status(400).send('User does not exist');

    }

    const checkPassword = await bcrypt.compare(password, user.password_hash);

    if (!checkPassword) {

        return res.status(401).send('User does not exist');

    }

    // window.location.href = "/";

    return res.status(200).json({

        message: 'login successfull',
        userId: user.id,
        username: user.username,

    })

}

module.exports = {
    listRestaurants,
    listDishes,
    signUp,
    login
};