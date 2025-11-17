const express = require('express');
const path = require('path');
const { listRestaurants, listDishes, listBasket, createBasketItem} = require('./app/controller/api');



const app = express();
const PORT = 5000;


app.use(express.static(path.join(__dirname, 'app/view')));

app.use(express.json());


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

app.get('/basket', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/basket.html'));
})


app.get('/api/basket', listBasket);
app.post('/api/basket', createBasketItem);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));