const express = require('express');
const path = require('path');
<<<<<<< Updated upstream
const { listRestaurants, listDishes } = require('./app/controller/api');
=======
const { 
    listRestaurants, 
    listDishes, 
    listBasket,
    createBasketItem,
    removeBasketItem,
    changeBasketQuantity
    } = require('./app/controller/api');


>>>>>>> Stashed changes

const app = express();
const PORT = 5000;


app.use(express.static(path.join(__dirname, 'app/view')));


app.get('/', (req, res) => {
    res.redirect('/index');
});


app.get('/api/restaurants', listRestaurants);


app.get('/api/restaurants/:id/dishes', listDishes);

app.use('/assets', express.static(path.join(__dirname, 'app/view')));

app.get('/restaurants/:id/dishes', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/restaurantDetail.html'));
});


app.get('/restaurants', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/restaurants.html'));
});

app.get('/detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/restaurantDetail.html'));
});



<<<<<<< Updated upstream
=======

//Basket html page
app.get('/basket', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/basket.html'));
});


app.get('/api/basket', listBasket);
app.post('/api/basket', createBasketItem);
app.delete("/api/basket/:id", removeBasketItem);
app.patch("/api/basket/:dishId", changeBasketQuantity);


>>>>>>> Stashed changes
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));