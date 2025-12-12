async function fetchDishesByRestaurantId(restaurantId) {

    const isLoggedIn = await isUserLoggedIn();

    const res = await fetch(`/api/restaurants/${restaurantId}/dishes`);
    const data = await res.json();

    if (data.length === 0) {

        const place = document.getElementById('dish-list');
        const noDishesText = document.createElement('p');
        noDishesText.innerHTML = `
                    <p class="container p-5">...No dishes found</p>
                `
        place.appendChild(noDishesText);
    }
    else {
        const list = document.getElementById('dish-list');
        data.forEach(r => {
            const colDiv = document.createElement('div');
            colDiv.className = 'col';


            const li = document.createElement('li');
            li.className = 'menu-list-item p-4 shadow-sm';


            const basketButtonHTML = isLoggedIn
                ?
                `<button 
                  class="btn btn-sm btn-success mt-2"
                  onclick="addToBasket(${r.id})">
                  Add to Basket
              </button>
                
            
                `
                : `<a href="/login" class="btn btn-sm btn-warning mt-2">
                  Log In to Order
              </a>`;


            li.innerHTML = `
                <div class="dish-card-content">
                    ${r.image_url ? `<img src="${r.image_url}" alt="${r.name}" class="dish-img mb-3" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">` : ''}
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="dish-details flex-grow-1 me-3">
                            <h3>${r.name}</h3>
                            <span class="description-text">${r.description}</span>
                        </div>
                        
                        <div class="price-and-button text-end">
                            <span class="dish-price">€${r.price}</span>
                            ${basketButtonHTML}
                        </div>
                    </div>
                    
                </div>
            `;


            colDiv.appendChild(li);

            list.appendChild(colDiv);
        });
    }
}

function getRestaurantId() {

    const path = window.location.pathname;
    const segments = path.split('/');

    const restaurantId = segments[2];

    return parseInt(restaurantId, 10)


}




//Add to basket function
async function addToBasket(dishId) {
    // Check if user is logged in first
    const isLoggedIn = await isUserLoggedIn();
    if (!isLoggedIn) {
        alert("Please log in to add items to your basket");
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch("/api/basket", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({
                dish_id: dishId
            })
        });

        if (response.ok) {
            alert("Dish added to basket!");
        } 
        else {
            try {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                alert("Failed to add dish: " + (errorData.message || errorData.error || response.statusText));
            } 
            catch (e) {
                console.error("Error parsing response:", e);
                alert("Failed to add dish: " + response.statusText);
            }
        }
    } catch (error) {
        console.error("Error adding to basket:", error);
        alert("Failed to add dish. Please try again.");
    }
}


function renderRestaurantHeader(restaurant) {
    const headerContainer = document.getElementById('restaurant-info');
    headerContainer.innerHTML = `
        <img src="${restaurant.image_url}" 
             alt="${restaurant.name}" 
             class="img-fluid mb-4" 
             style="max-height: 300px; width: 100%; object-fit: cover; border-radius: 8px;">
        
        <h1 class="display-4 fw-bold mb-0">${restaurant.name}</h1>
        `;
}

async function fetchRestaurantDetails(restaurantId) {
    try {
        const res = await fetch('/api/restaurants/');
        if (!res.ok) {
            throw new Error('Failed to fetch restaurant details');
        }
        const data = await res.json();

        const dataParsed = data[restaurantId - 1];

        renderRestaurantHeader(dataParsed);
    } catch (error) {
        console.error("Error fetching restaurant details:", error);
        document.getElementById('restaurant-info').innerHTML =
            '<h2 class="text-danger">Could not load restaurant information.</h2>';
    }
}

restaurantId = getRestaurantId()
fetchRestaurantDetails(restaurantId);
fetchDishesByRestaurantId(restaurantId);

