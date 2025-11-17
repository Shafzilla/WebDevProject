async function fetchDishesByRestaurantId(restaurantId) {

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


            li.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <h3>${r.name}</h3>
                                <span class="ms-3 me-4 text-end">
                                     <br>
                                    <span class="text-primary fw-light">${r.description}</span>
                                    <p>$${r.price}</p>
                                </span>
                            </div>
                        </div>
                        <p class="text-secondary small mt-2 fst-italic"></p>
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

restaurantId = getRestaurantId()
<<<<<<< Updated upstream
fetchDishesByRestaurantId(restaurantId);
=======
fetchDishesByRestaurantId(restaurantId);



//Add to basket function
async function addToBasket(dishId) {

    const response = await fetch("/api/basket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: 1, //for testing now, replace with actual user id later
            dish_id: dishId,
            quantity: 1
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
}
>>>>>>> Stashed changes
