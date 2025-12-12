DROP TABLE IF EXISTS basket;
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
    description TEXT,
    price DECIMAL(6,2),
    available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
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
-- A user can only have one entry per dish (unique constraint)
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
    ('Falafel', 'https://media-cdn.tripadvisor.com/media/photo-s/13/8b/09/2d/our-newly-refurbished.jpg', 'middle eastern',5.0,'coolmine, Dublin 15',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Zouq', 'https://rs-menus-api.roocdn.com/images/c60e2ded-3791-4e1e-81c8-bb450a13c470/image.jpeg', 'Pakistani',4.9,'coolmine, Dublin 15',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Xian Street Food Dublin', 'https://secretdublin.com/wp-content/uploads/2023/07/xian-street-food.jpg', 'chineese',4.4,'28 Anne St S, Dublin D02 DX39',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Reyna', 'https://offloadmedia.feverup.com/secretdublin.com/wp-content/uploads/2023/08/13105905/reyna-1-1024x1024.jpg', 'Turkish',4.2,'29-30 Dame St, Dublin D02 A025',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Passion 4 food', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/a3/dd/60/all-our-meals-are-freshly.jpg', 'Persian',4.2,' Clanbrassil St. Dublin 8 35 Main St , Ongar Village Dublin 15',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Boojum', 'https://tb-static.uber.com/prod/image-proc/processed_images/ba2649c7a9eb011fccfa8a861a18b88a/3ac2b39ad528f8c8c5dc77c59abb683d.jpeg', 'Mexican',4.4,'Unit 452, Blanchardstown Centre, Dublin, Ireland D15 E77C',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Musashi', 'https://media-cdn.tripadvisor.com/media/photo-s/08/be/da/47/musashi-sushi-fusion.jpg', 'Japanese',4.7,' Blanchardstwown Shopping Centre, Dublin 15',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Damascus Gate', 'https://rs-menus-api.roocdn.com/images/b893d3ac-a7f3-4fe9-92aa-8a35480f6cb3/image.jpeg', 'Syrian',5.0,'10 Upper Camden street, Dublin 2',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Offbeat Donuts', 'https://rs-menus-api.roocdn.com/images/3b89a211-0eb0-4fbe-b346-17f0534612f9/image.jpeg', 'Desserts', 4.8, 'Westland Row Dublin DUBLIN 2 Dublin City',NULL,NULL,'2025-11-03 09:20:07.325451'),
    ('Crispy Kreme', 'https://content.fortune.com/wp-content/uploads/2016/03/gettyimages-540031879-1.jpg', 'Desserts', 4.3,'Unit 457 Blanchardstown Centre Blanchardstown D15 Y189 Dublin',NULL,NULL,'2025-11-03 09:20:07.325451');




INSERT INTO dishes (restaurant_id, "name", description, price, available, image_url, created_at) VALUES
-- 1. Pizza Hut
(1,'Pepperoni Pizza','halal',12.99,true,'https://metropizzachicken.ca/wp-content/uploads/2019/05/main-pizza-slide.jpg','2025-11-03 09:20:07.325451'),
(1,'Veggie Pizza','halal',10.99,true,'https://kristineskitchenblog.com/wp-content/uploads/2024/12/veggie-pizza-recipe-09.jpg','2025-11-03 09:20:07.325451'),
(1,'Garlic Bread','Side, vegetarian',4.99,true,'https://www.ambitiouskitchen.com/wp-content/uploads/2023/02/Garlic-Bread-4.jpg','2025-11-03 09:20:07.325451'),

-- 2. Apache Pizza
(2,'margherita pizza','halal',9.50,true,'https://thumbs.dreamstime.com/b/hot-margarita-pizza-served-rosemary-hot-margarita-pizza-126018293.jpg','2025-11-03 09:20:07.325451'),
(2,'Cheese Fries','vegan',4.25,true,'https://becentsational.com/wp-content/uploads/2024/01/Cheese-Fries-3.jpg','2025-11-03 09:20:07.325451'),
(2,'BBQ Chicken Pizza','contains chicken',13.50,true,'https://eatwhatweeat.com/wp-content/uploads/2022/04/bbq-chicken-pizza-unique-weeknight-bbq-chicken-pizza-of-bbq-chicken-pizza.jpg','2025-11-03 09:20:07.325451'),

-- 3. Burger Town
(3,'Double Beef Burger','Irish beef',11.99,true,'https://img.freepik.com/premium-photo/double-beef-burger-with-extra-bun-layers-cheese_124507-27724.jpg','2025-11-03 09:20:07.325451'),
(3,'Chicken Tenders','crispy fried strips',7.99,true,'https://foxeslovelemons.com/wp-content/uploads/2023/05/Buttermilk-Chicken-Tenders-5.jpg','2025-11-03 09:20:07.325451'),
(3,'Loaded Nachos','jalapeños & cheese',6.49,true,'https://veganbell.com/wp-content/uploads/2022/09/Loaded-Nachos-with-Vegan-Cheese-Sauce-1.jpg','2025-11-03 09:20:07.325451'),

-- 4. Falafel
(4,'Falafel Wrap','halal, vegan',7.50,true,'https://beingnutritious.com/wp-content/uploads/2022/07/Baked-falafel-wrap-scaled.jpg','2025-11-03 09:20:07.325451'),
(4,'Hummus Plate','vegan, halal',5.99,true,'https://www.aline-made.com/wp-content/uploads/2023/10/Hummus-1-2-720x1080.jpg','2025-11-03 09:20:07.325451'),
(4,'Falafel Box','falafel, rice, salad',8.99,true,'https://i.pinimg.com/originals/07/b7/ae/07b7aea50ab17ae29d46b45d5ec02a0d.jpg','2025-11-03 09:20:07.325451'),
(4,'Palestine Coke','Drink, juice',2.50,true,'https://thebosniatimes.ba/wp-content/uploads/2024/03/palestine-group-cola-1024x612.png','2025-11-03 09:20:07.325451'),
(4,'Guafa','fruity drink',5.00,true,'https://img.freepik.com/premium-photo/papaya-juice-restaurant-table_160148-2623.jpg','2025-11-03 09:20:07.325451'),
(4,'orange juice','fresh juice, drink',3.99,true,'https://www.wallpapers-for-desktop.eu/desktop/orange-drink-orange.jpg','2025-11-03 09:20:07.325451'),

-- 5. Zouq
(5,'Chicken Biryani','halal Pakistani style',10.99,true,'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/02/hyderabadi-biryani-recipe-chicken.jpg','2025-11-03 09:20:07.325451'),
(5,'Kebab Platter','halal mix grill',14.50,true,'https://img.freepik.com/premium-photo/traditional-indian-brass-platter-seekh-kebabs_1179130-184556.jpg','2025-11-03 09:20:07.325451'),
(5,'Butter Chicken','creamy curry',12.50,true,'https://www.cookingclassy.com/wp-content/uploads/2021/01/butter-chicken-3.jpg','2025-11-03 09:20:07.325451'),

-- 6. Xian Street Food
(6,'Biang Biang Noodles','spicy halal noodles, pasta',11.99,true,'https://taste.co.za/wp-content/uploads/2025/01/Biang-biang-noodles.jpg','2025-11-03 09:20:07.325451'),
(6,'Dumplings 10pc','halal chicken dumplings',8.50,true,'https://therecipecritic.com/wp-content/uploads/2023/02/soup_dumplings.jpg','2025-11-03 09:20:07.325451'),
(6,'Sweet & Sour Chicken','halal',10.50,true,'https://tipbuzz.com/wp-content/uploads/Sweet-and-Sour-Chicken-3.jpg','2025-11-03 09:20:07.325451'),
(6, 'Spaghetti Carbonara', 'halal pasta', 12.00, true, 'https://pardisitalian.com/wp-content/uploads/2024/11/Spaghetti-Carbonara.jpg', '2025-11-03 10:10:11.221341'),
(6, 'Fettuccine Alfredo', 'halal pasta', 11.50, true, 'https://i1.wp.com/eatsdelightful.com/wp-content/uploads/2020/09/fettuccine-alfredo-complete.jpg', '2025-11-03 10:15:44.118320'),
(6, 'Penne Arrabbiata', 'halal pasta', 10.00, true, 'https://afoodloverskitchen.com/wp-content/uploads/arrabbiata-featured-800x800.jpg', '2025-11-03 10:18:59.551120'),
(6, 'Macaroni Cheese', 'halal pasta', 9.50, true, 'https://www.cdcare.org/wp-content/uploads/macaroni-and-cheese-vegan-healthy1.jpg', '2025-11-03 10:22:14.448231'),
(6, 'Lasagna Bolognese', 'halal pasta', 13.00, true, 'https://img.freepik.com/premium-photo/macaroni-cheese-lasagna_974629-135787.jpg', '2025-11-03 10:25:47.774511'),


-- 7. Reyna
(7,'Doner Kebab','Turkish style halal',9.50,true,'https://www.jocooks.com/wp-content/uploads/2023/04/chicken-doner-kebab-1-1229x1536.jpg','2025-11-03 09:20:07.325451'),
(7,'Chicken Shish','grilled skewers',12.99,true,'https://t3.ftcdn.net/jpg/08/97/18/54/360_F_897185426_WMp7CeP9Lfs1vzYxM8Z4buegx6eQjLko.jpg','2025-11-03 09:20:07.325451'),
(7,'Baklava','traditional Turkish dessert',4.99,true,'https://d2j6dbq0eux0bg.cloudfront.net/images/57912005/3314851579.jpg','2025-11-03 09:20:07.325451'),

-- 8. Passion 4 Food
(8,'Shawarma Wrap','halal Persian style',8.99,true,'https://www.mommytravels.net/wp-content/uploads/2023/01/Shawarma-wrap.jpg','2025-11-03 09:20:07.325451'),
(8,'Mixed Grill','kebab, rice, salad',14.99,true,'https://cdn.pixabay.com/photo/2022/08/27/14/08/mix-grill-7414547_1280.jpg','2025-11-03 09:20:07.325451'),
(8,'chicken wings','vegetarian',7.99,true,'https://www.tasteofhome.com/wp-content/uploads/2018/01/Best-Ever-Fried-Chicken-Wings_EXPS_THFM18_208490_D09_19_4b.jpg','2025-11-03 09:20:07.325451'),

-- 9. Boojum
(9,'Burrito','vegan/halal options',8.99,true,'https://cdn.pixabay.com/photo/2022/05/23/20/47/burrito-7217208_1280.jpg','2025-11-03 09:20:07.325451'),
(9,'Bowl','rice, beans, toppings',9.50,true,'https://cocinarepublic.com/wp-content/uploads/2024/10/street-corn-chicken-rice-bowl-with-crema-and-chips-1152x1536.jpg','2025-11-03 09:20:07.325451'),
(9,'Nachos','vegan cheese option',6.50,true,'https://thegirlonbloor.com/wp-content/uploads/2017/02/30-Minute-Irish-Potato-Nachos-9.jpg','2025-11-03 09:20:07.325451'),
(9,'Beef Tacos','beef',14.50,true,'https://oaxacacapital.com/wp-content/uploads/2023/12/tacos-versatiles-1140x570.jpg','2025-11-03 09:20:07.325451'),
(9,'Chicken Tacos','Chicken, halal',16.50,true,'https://beesrecipes.com/wp-content/uploads/2024/09/Classic-Beef-Tacos-Recipe-1024x683.png','2025-11-03 09:20:07.325451'),
(9,'Vegan Tacos','beef',15.50,true,'https://cookieandkate.com/images/2018/04/best-vegetarian-tacos-recipe-2.jpg','2025-11-03 09:20:07.325451'),


-- 10. Musashi
(10,'Salmon Sushi Set','Japanese',13.99,true,'https://img.freepik.com/premium-photo/gourmet-seafood-presentation-with-sushi-sashimi-wasabi-by-generative-ai_829925-6370.jpg','2025-11-03 09:20:07.325451'),
(10,'Chicken Katsu Curry','Japanese curry',12.50,true,'https://i.pinimg.com/originals/69/94/d1/6994d1243698509ae71a492830ea548d.jpg','2025-11-03 09:20:07.325451'),
(10,'Ramen Bowl','noodles with broth',11.50,true,'https://40aprons.com/wp-content/uploads/2016/01/bacon-ramen-1-650x975.jpg','2025-11-03 09:20:07.325451'),
(10,'Hosomaki Sushi Set','Japanese, halal',13.99,true,'https://www.streetfoodnews.it/wp-content/uploads/2024/04/hosomaki-sushi-20240415-streetfoodnews.it_.jpg','2025-11-03 09:20:07.325451'),
(10,'Sashimi Sushi','Japanese sushi',12.50,true,'https://www.lacademie.com/wp-content/uploads/2022/12/raw-tuna-550x413.jpg','2025-11-03 09:20:07.325451'),
(10,'Maki Sushi','noodles with broth',11.50,true,'https://img.freepik.com/premium-photo/sushi-roll-japanese-maki-with-egg-seaweed-kani-cut-set-wooden-plate_127090-1266.jpg','2025-11-03 09:20:07.325451'),


-- 11. Damascus Gate
(11,'Mixed Grill','halal Syrian grill',15.50,true,'https://i.pinimg.com/originals/05/78/71/057871d96c4383942a9aa7ee3597be37.jpg','2025-11-03 09:20:07.325451'),
(11,'Fattoush Salad','fresh Syrian salad',6.50,true,'https://i.pinimg.com/originals/e2/25/b6/e225b630aeb5021a5a66e5061d618f11.jpg','2025-11-03 09:20:07.325451'),
(11,'Shish Tawook','grilled chicken cubes',12.99,true,'https://amiraspantry.com/wp-content/uploads/2020/06/shish-tawooq-I.jpg','2025-11-03 09:20:07.325451'),
(11,'warak inab','vegetarian',7.99,true,'https://i.pinimg.com/736x/81/0c/39/810c39dc4e9e7cec9374447e7f9c90d8.jpg','2025-11-03 09:20:07.325451'),


-- 12. Offbeat Donuts
(12,'Nutella Donut','dessert',3.50,true,'https://data.thefeedfeed.com/static/2022/11/21/1669072359637c05e75b5c6.jpg','2025-11-03 09:20:07.325451'),
(12,'Caramel Ring','dessert',3.25,true,'https://lovewithdonut.com.au/wp-content/uploads/2024/04/Donut-Carmel-KFC.jpg','2025-11-03 09:20:07.325451'),
(12,'Red Velvet Donut','dessert',3.75,true,'https://parsleyandicing.com/wp-content/uploads/2021/02/red-velvet-donuts-1-of-1-rotated.jpg','2025-11-03 09:20:07.325451'),

-- 13. Krispy Kreme
(13,'Original Glazed','dessert',2.50,true,'https://www.allrecipes.com/thmb/o0_-y4sAnvxWZyuplkgCzitSXU0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ar-krispy-kreme-kk-4x3-51338ff81d6344afbd973164ca70bb7c.jpg','2025-11-03 09:20:07.325451'),
(13,'Chocolate Iced','dessert',2.70,true,'https://houseofnasheats.com/wp-content/uploads/2021/08/Baked-Chocolate-Donuts-22-680x1020.jpg','2025-11-03 09:20:07.325451'),
(13,'Strawberry Sprinkles','dessert',2.80,true,'https://shesnotcookin.com/wp-content/uploads/2022/02/baked-strawberry-frosted-donuts-2-731x1024.jpg','2025-11-03 09:20:07.325451');
