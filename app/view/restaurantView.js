async function fetchRestaurants() {

    const res = await fetch('/api/restaurants');
    const data = await res.json();
    console.log(data);

    const list = document.getElementById('restaurant-list');

    data.forEach(r => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col';

        const li = document.createElement('li');
        li.className = 'restaurant-item p-4 shadow-sm';


        const link = document.createElement('a')
        link.href = `/restaurants/` + r.id + `/dishes`;


        const addressButton = document.createElement('button');
        addressButton.className = 'btn btn-outline-secondary btn-sm';
        addressButton.textContent = 'Show Address';
        // addressButton.style.marginLeft = '10px';
        // addressButton.style.padding = '4px 8px';
        addressButton.style.cursor = 'pointer';

        addressButton.dataset.restaurantId = r.id;
        addressButton.addEventListener('click', (event) => {
            event.stopPropagation();
            displayAddress(r.address, addressButton);
        });

        li.innerHTML = `
                    <img src="${r.image_url}" alt="${r.name}" class="restaurant-img mb-2">
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <h3>${r.name}</h3>

                            <img src="https://icon-library.com/images/rating-star-icon-png/rating-star-icon-png-8.jpg" class="rating-star-image">
                            <p class="text-primary fw-bold">${r.rating}</p>
                        </div>
                    </div>
                `;

        const mainContentDiv = li.querySelector('.d-flex.justify-content-between');

        mainContentDiv.appendChild(addressButton);
        li.querySelector('div').appendChild(addressButton);

        li.addEventListener('click', () => {
            window.location.href = "/restaurants/" + r.id + "/dishes";
            // fetchDishes(r.id, li);
        });


        li.appendChild(link)


        colDiv.appendChild(li);



        list.appendChild(colDiv);
    });
}


function displayAddress(address, buttonElement) {

    const addressID = `address-${buttonElement.dataset.restaurantId}`;
    let addressDisplay = document.getElementById(addressID);
    if (addressDisplay) {
        addressDisplay.remove();
        buttonElement.textContent = 'Show Address';
        buttonElement.style.backgroundColor = '';
    } else {
        addressDisplay = document.createElement('p');
        addressDisplay.id = addressID;
        addressDisplay.textContent = `Address: ${address}`;
        addressDisplay.style.fontWeight = 'bold';

        const li = buttonElement.closest('.restaurant-item');

        const contentDiv = li.querySelector('div');
        contentDiv.after(addressDisplay);


        buttonElement.textContent = 'Hide Address';
        buttonElement.style.backgroundColor = '#d3d3d3';


    }

}



function filterRestaurants() {

    // parsing the index page into different variables
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();

    const ul = document.getElementById('restaurant-list');

    const colDivs = ul.getElementsByClassName('col');


    for (let i = 0; i < colDivs.length; i++) {

        const listItem = colDivs[i].querySelector('.restaurant-item');

        if (listItem) {
            const restaurantNameElement = listItem.querySelector('h3');
            const nameText = restaurantNameElement ? restaurantNameElement.textContent.toLowerCase() : '';

            if (nameText.includes(filter)) {
                colDivs[i].style.display = "";
            } else {
                colDivs[i].style.display = "none";
            }
        }
    }
}



// Food type filter functionality
let currentFilter = null;

async function filterByFoodType(foodType) {
    // Toggle behavior: if the same filter is clicked again, clear it
    if (currentFilter === foodType) {
        clearFilter();
        return;
    }
    
    currentFilter = foodType;
    
    // Update UI to show we're filtering
    document.getElementById('page-title').textContent = `Dishes - ${foodType.charAt(0).toUpperCase() + foodType.slice(1)}`;
    
    // Highlight the selected filter
    const cuisineButtons = document.querySelectorAll('.cuisine');
    cuisineButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick')?.includes(foodType)) {
            btn.classList.add('active');
        }
    });
    
    try {
        const res = await fetch(`/api/dishes/filter/${foodType}`);
        const dishes = await res.json();
        
        const list = document.getElementById('restaurant-list');
        // Clear existing content
        list.innerHTML = ''; 
        
        if (dishes.length === 0) {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-12';
            colDiv.innerHTML = '<p class="text-center p-5">No dishes found for this filter.</p>';
            list.appendChild(colDiv);
        } 
        else {
            // Check login status once before the loop
            const isLoggedIn = await isUserLoggedIn();
            
            dishes.forEach(dish => {
                const colDiv = document.createElement('div');
                colDiv.className = 'col';
                
                const li = document.createElement('li');
                li.className = 'restaurant-item p-4 shadow-sm';
                li.style.cursor = 'pointer';
                
                const basketButtonHTML = isLoggedIn
                    ? `<button 
                          class="btn btn-sm btn-success mt-2"
                          onclick="event.stopPropagation(); addToBasketFromFilter(${dish.id})">
                          Add to Basket
                      </button>`
                    : `<a href="/login" class="btn btn-sm btn-warning mt-2" onclick="event.stopPropagation();">
                          Log In to Order
                      </a>`;
                
                li.innerHTML = `
                    <div class="d-flex flex-column">
                        ${dish.image_url ? `<img src="${dish.image_url}" alt="${dish.name}" class="dish-img mb-3" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">` : ''}
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h4>${dish.name}</h4>
                                <p class="text-muted mb-1">${dish.restaurant_name}</p>
                                ${dish.description ? `<p class="text-secondary small">${dish.description}</p>` : ''}
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-primary fw-bold">€${dish.price}</span>
                            ${basketButtonHTML}
                        </div>
                    </div>
                `;
                
                li.addEventListener('click', () => {
                    window.location.href = `/restaurants/${dish.restaurant_id}/dishes`;
                });
                
                colDiv.appendChild(li);
                list.appendChild(colDiv);
            });
        }
    } catch (error) {
        console.error('Error fetching filtered dishes:', error);
        const list = document.getElementById('restaurant-list');
        list.innerHTML = '<div class="col-12"><p class="text-center text-danger p-5">Error loading dishes. Please try again.</p></div>';
    }
}

function clearFilter() {
    currentFilter = null;
    document.getElementById('page-title').textContent = 'Restaurants';
    
    // Remove active class from all cuisine buttons
    const cuisineButtons = document.querySelectorAll('.cuisine');
    cuisineButtons.forEach(btn => btn.classList.remove('active'));
    
    // Reload restaurants
    const list = document.getElementById('restaurant-list');
    list.innerHTML = '';
    fetchRestaurants();
}

async function isUserLoggedIn() {
    try {
        const res = await fetch('/api/user');
        return res.status === 200;
    } catch (e) {
        return false;
    }
}

async function addToBasketFromFilter(dishId) {
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
        } else {
            const errorData = await response.json();
            alert("Failed to add dish: " + (errorData.message || errorData.error || response.statusText));
        }
    } catch (error) {
        console.error("Error adding to basket:", error);
        alert("Failed to add dish. Please try again.");
    }
}

fetchRestaurants();