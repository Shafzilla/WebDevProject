

async function loadBasket() {
        const res = await fetch("/basket");
        const data = await res.json();

        const container = document.getElementById("basket-products");
        container.innerHTML = ""; // reset

        let total = 0;

        if (data.length === 0) {
            container.innerHTML = `
                <p class="text-muted mt-5">Your basket is empty.</p>
            `;
            document.getElementById("basket-total").innerText = "0.00";
            return;
        }

        data.forEach(item => {

            const itemTotal = item.quantity * parseFloat(item.dish_price);
            total += itemTotal;

            const card = `
                <div class="card mb-3 shadow-sm p-3 basket-card">

                    <div class="d-flex">

                        <img src="${item.restaurant_image}" class="basket-image me-3">

                        <div class="w-100">

                            <h5>${item.dish_name}</h5>
                            <p class="text-muted small">${item.restaurant_name}</p>

                            <p class="mb-1"><strong>Price:</strong> $${item.dish_price}</p>
                            <p class="mb-1"><strong>Quantity:</strong> ${item.quantity}</p>
                            <p><strong>Item Total:</strong> $${itemTotal.toFixed(2)}</p>

                            <button class="btn btn-danger btn-sm" onclick="removeFromBasket(${item.basket_id})">
                                Remove
                            </button>

                        </div>

                    </div>
                </div>
            `;

            container.innerHTML += card;
        });

        document.getElementById("basket-total").innerText = total.toFixed(2);
    }


