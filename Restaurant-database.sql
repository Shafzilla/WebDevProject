DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS dishes;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS users;

-- ===========================================
-- USERS
-- ===========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- RESTAURANTS
-- ===========================================
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    cuisine_type VARCHAR(50),
    rating DECIMAL(2,1),
    address TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- DISHES
-- Each dish belongs to a restaurant
-- If a restaurant is deleted, all its dishes are deleted automatically
-- ===========================================
CREATE TABLE dishes (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    dish_url TEXT,
    description TEXT,
    price DECIMAL(6,2),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ORDERS
-- Each order belongs to a user and a dish
-- If a user or dish is deleted, their orders are deleted automatically
-- ===========================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    dish_id INTEGER REFERENCES dishes(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    status VARCHAR(20), -- e.g. pending, delivered, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- ===========================================
-- basket
-- Each basket belongs to a user 
-- If a user is deleted, their basket is deleted automatically
-- ===========================================
CREATE TABLE basket (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    dish_id INTEGER REFERENCES dishes(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    UNIQUE(user_id, dish_id)
);



INSERT INTO restaurants ("name", image_url, cuisine_type,rating,address,latitude,longitude,created_at) VALUES
    ('Pizza hut', 'https://tb-static.uber.com/prod/image-proc/processed_images/2aa841d85d959a0667efddc7834e915b/3ac2b39ad528f8c8c5dc77c59abb683d.jpeg', 'Italian',4.4,'Dublin 15',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Apache Pizza', 'https://www.westend.ie/wp-content/uploads/2021/03/apache-pizza-web.png', 'Italian',4.0,'Dublin 15',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Burger Town', 'https://imageproxy.wolt.com/venue/63724e9b5f29be18e69d5876/d54913e6-64f7-11ed-9227-c6888263d050_99b5a7be_2dec_11ed_992c_be8780cc411a_22db93ee_3d7c_11ec_ad19_a20d92c72690_wolt21.11.2ritas_burgerbar26971.jpg', 'Irish', 4.2, 'Dublin 14', NULL, NULL, '2025-11-03 09:20:07.325451'),
    ('Falafel', 'https://media-cdn.tripadvisor.com/media/photo-s/13/8b/09/2d/our-newly-refurbished.jpg', 'middle eastern, halal',5.0,'coolmine, Dublin 15',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Zouq', 'https://rs-menus-api.roocdn.com/images/c60e2ded-3791-4e1e-81c8-bb450a13c470/image.jpeg', 'Pakistani, halal',4.9,'coolmine, Dublin 15',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Xian Street Food Dublin', 'https://secretdublin.com/wp-content/uploads/2023/07/xian-street-food.jpg', 'chineese, halal',4.4,'28 Anne St S, Dublin D02 DX39',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Reyna', 'https://offloadmedia.feverup.com/secretdublin.com/wp-content/uploads/2023/08/13105905/reyna-1-1024x1024.jpg', 'Turkish, halal',4.2,'29-30 Dame St, Dublin D02 A025',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Passion 4 food', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/a3/dd/60/all-our-meals-are-freshly.jpg', 'Persian, halal',4.2,' Clanbrassil St. Dublin 8 35 Main St , Ongar Village Dublin 15',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Boojum', 'https://tb-static.uber.com/prod/image-proc/processed_images/ba2649c7a9eb011fccfa8a861a18b88a/3ac2b39ad528f8c8c5dc77c59abb683d.jpeg', 'Mexican, Vegan',4.4,'Unit 452, Blanchardstown Centre, Dublin, Ireland D15 E77C',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Musashi', 'https://media-cdn.tripadvisor.com/media/photo-s/08/be/da/47/musashi-sushi-fusion.jpg', 'Japanese',4.7,' Blanchardstwown Shopping Centre, Dublin 15',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Damascus Gate', 'https://rs-menus-api.roocdn.com/images/b893d3ac-a7f3-4fe9-92aa-8a35480f6cb3/image.jpeg', 'Syrian, halal',5.0,'10 Upper Camden street, Dublin 2',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Offbeat Donuts', 'https://rs-menus-api.roocdn.com/images/3b89a211-0eb0-4fbe-b346-17f0534612f9/image.jpeg', 'Desserts', 4.8, 'Westland Row Dublin DUBLIN 2 Dublin City',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Crispy Kreme', 'https://content.fortune.com/wp-content/uploads/2016/03/gettyimages-540031879-1.jpg', 'Desserts', 4.3,'Unit 457 Blanchardstown Centre Blanchardstown D15 Y189 Dublin',NULL,NULL,'2025-11-03 09:20:07.325451');


INSERT INTO dishes (restaurant_id,"name",description,price,available,created_at) VALUES
    (1,'Pepperoni Pizza',NULL,12.99,true,'2025-11-03 09:20:07.325451'),
    (1,'Veggie Pizza',NULL,10.99,true,'2025-11-03 09:20:07.325451'),
    (2,'Classic Burger',NULL,9.50,true,'2025-11-03 09:20:07.325451'),
    (2,'Cheese Fries',NULL,4.25,true,'2025-11-03 09:20:07.325451');


INSERT INTO users (username, email, password_hash) VALUES
    ('hanna', 'hana@gmail.com', 'qw');
  

INSERT INTO basket (user_id, dish_id, quantity) VALUES
    (1,1,1);
