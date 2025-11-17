async function loadBasket() {
    const res = await fetch("/api/basket");
    const data = await res.json();

    const container = document.getElementById("basket-products");
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = `<p>Your basket is empty.</p>`;
        return;
    }

    let total = 0;
    let html = "";

    data.forEach(item => {
        const itemTotal = item.quantity * item.dish_price;
        total += itemTotal;

        html += `
            <div class="card p-3 mb-3">
                <h5>${item.dish_name}</h5>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.dish_price}</p>
                <p><strong>Total: $${itemTotal.toFixed(2)}</strong></p>

                <button class="btn btn-success" 
                    onclick="changeQuantity(${item.dish_id}, 1)">
                    +
                </button>
                <button class="btn btn-warning" 
                    onclick="changeQuantity(${item.dish_id}, -1)">
                    -
                </button>
                <button class="btn btn-danger"
                    onclick="removeFromBasket(${item.basket_id})">
                    Remove
                </button>
            </div>
        `;
    });

    container.innerHTML = html;

    document.getElementById("basket-total").innerText = total.toFixed(2);
}

//Call loadBasket when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadBasket();
});




async function removeFromBasket(basketId) {
    try {
        const res = await fetch(`/api/basket/${basketId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            alert("Item removed from basket");
            //refresh the basket after deletion
            loadBasket(); 
        } 
        else {
            alert("Failed to remove item");
        }
    } 
    catch (err) {
        console.error(err);
        alert("Error removing item");
    }
}




async function changeQuantity(dishId, change) {
    const res = await fetch(`/api/basket/${dishId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ change })
    });

    if (!res.ok) {
        const error = await res.json();
        alert(error.error);
        return;
    }
    
    loadBasket();
}
