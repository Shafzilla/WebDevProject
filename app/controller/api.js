const { getAllRestaurants, getDishesByRestaurantId } = require('../model/restaurant');
const { createUser, getUserByUsername} = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

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





module.exports = {
    listRestaurants,
    listDishes,
    signUp,
    login,
    authenticateToken,
    getUserDetails,
};