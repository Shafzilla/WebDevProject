const express = require('express');

const path = require('path');
const { listRestaurants, listDishes, signUp, login} = require('./app/controller/api');

const app = express();
const PORT = 5000;

app.use(express.json());

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

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/signup.html'));
})

app.post('/api/signup', signUp);

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/view/login.html'));
})

app.post('/api/login', login);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));