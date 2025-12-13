const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

//imports
const { listRestaurants, listDishes, listDishesByFoodType, listBasket, createBasketItem, removeBasketItem, changeBasketQuantity, signUp, login, authenticateToken, getUserDetails} = require('./app/controller/api');


const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'app/view')));


app.get('/', (req, res) => {

    if (req.cookies.token) {

        res.redirect('/index.html')
    }
    else {

        res.redirect('/login')
    }
});



app.get('/api/restaurants', listRestaurants); // api endpoint with all restaurants


app.get('/api/restaurants/:id/dishes',  listDishes); // endpoint with all dishes with specific restaurantId
app.get('/api/dishes/filter/:foodType', listDishesByFoodType);// endpoint with all dishes with specific food type



app.use('/assets', express.static(path.join(__dirname, 'app/view')));

//route for restaurant details with specified restaurantId
app.get('/restaurants/:id/dishes',  (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/restaurantDetail.html'));
});


app.get('/restaurants', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/restaurants.html'));
});

app.get('/detail', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/restaurantDetail.html'));
});

// route for signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/signup.html'));
})


app.post('/api/signup', signUp); // endpoint for signup information

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/login.html'));
})

app.post('/api/login', login); // endpoint for login information

app.get('/api/user', authenticateToken, getUserDetails); // endpoint for user information

app.post('/api/logout', (req, res) => {

    res.clearCookie('token');

    res.status(200).json({message:'logged out'});

});


//Basket html page
app.get('/basket', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/basket.html'));
});


app.get('/api/basket', authenticateToken, listBasket);
app.post('/api/basket', authenticateToken, createBasketItem);
app.delete("/api/basket/:id", authenticateToken, removeBasketItem);
app.patch("/api/basket/:dishId", authenticateToken, changeBasketQuantity);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
