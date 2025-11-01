const express = require('express');
const path = require('path');
const { listRestaurants, listDishes } = require('./app/controller/api');

const app = express();
const PORT = 5000;


app.use(express.static(path.join(__dirname, 'app/view')));


app.get('/', (req, res) => {
    res.redirect('/index');
});


app.get('/api/restaurants', listRestaurants);


app.get('/api/restaurants/:id/dishes', listDishes);

app.get('/restaurants', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/restaurants.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));