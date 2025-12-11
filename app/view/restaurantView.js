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



document.addEventListener('DOMContentLoaded', () => {

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {

        logoutButton.addEventListener('click', handleLogout);


    }
    updateBasketLink();
    checkLoginStatus();

});

async function handleLogout() {

    try {

        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }

        });
        if (response.status === 200) {

            alert('You Logged out');
            window.location.reload();

        } else {

            console.error('logout failed');
            alert('logout failed');

        }


    }
    catch (error) {

        console.error('network error', error);
        alert('network error')

    }



}

async function checkLoginStatus() {

    const greetingElement = document.getElementById('user-greeting');
    const logoutButton = document.getElementById('logout-button');

    const res = await fetch('/api/user');

    if (res.status === 200) {

        const userData = await res.json();

        greetingElement.innerHTML = `
            <p class="h4 fw-bold text-success">
            Hello, ${userData.username}!
            </p>
        
        `;

        logoutButton.style.display = 'inline-block';
        return true;
    }
    else {

        greetingElement.innerHTML = `
            <p class="h4 fw-bold text-danger">
                <a href="/login">Log In</a>
            </p>
        
        `;

        logoutButton.style.display = 'none';
        return false;

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


async function updateBasketLink() {

    const basketLink = document.querySelector('.shopping-cart a');

    const isLoggedIn = await checkLoginStatus();

    if (isLoggedIn) {
        basketLink.href = 'basket.html';
    } else {
        basketLink.href = 'login.html';
    }
}




fetchRestaurants();
checkLoginStatus();