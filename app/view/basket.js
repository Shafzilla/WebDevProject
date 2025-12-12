async function loadBasket() {
    try {
        const res = await fetch("/api/basket", {
            credentials: 'include'
        });
        
        if (!res.ok) {
            // Handle authentication errors
            if (res.status === 401 || res.status === 403) {
                const errorText = await res.text();
                console.error("Authentication error:", errorText);
                const container = document.getElementById("basket-products");
                if (container) {
                    container.innerHTML = `<p class="text-warning">Please <a href="/login">log in</a> to view your basket.</p>`;
                }
                return;
            }
            
            // Handle other errors - try to parse as JSON first
            let errorMessage = "Failed to fetch basket";
            try {
                const errorData = await res.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
                console.error("Server error response:", errorData);
            } catch (e) {
                const errorText = await res.text();
                errorMessage = errorText || errorMessage;
                console.error("Server error text:", errorText);
            }
            throw new Error(errorMessage);
        }
        
        const data = await res.json();
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
            console.error("Basket API returned non-array data:", data);
            throw new Error("Invalid basket data format");
        }

        const container = document.getElementById("basket-products");
        const totalElement = document.getElementById("basket-total");
        
        if (!container || !totalElement) {
            console.error("Basket container or total element not found");
            return;
        }

        container.innerHTML = "";

        if (data.length === 0) {
            container.innerHTML = `<p class="text-center">Your basket is empty.</p>`;
            totalElement.innerText = "0.00";
            return;
        }

        let total = 0;
        let html = "";

        data.forEach(item => {
            const itemTotal = item.quantity * item.dish_price;
            total += itemTotal;

            html += `
                <div class="card basket-card mb-3">
                    <div class="row g-0 h-100">
                        <div class="col-md-8">
                            <div class="card-body">
                                <div class="basket-card-content">
                                    <div>
                                        <h5 class="basket-card-title">${item.dish_name}</h5>
                                        <p class="basket-card-text">Price: $${item.dish_price}</p>
                                        <p class="basket-card-text"><strong>Total: $${itemTotal.toFixed(2)}</strong></p>

                                        
                                        <div class="basket-buttons-container">
                                            <div class="basket-quantity-controls">
                                                <button class="btn btn-warning btn-sm" 
                                                    onclick="changeQuantity(${item.dish_id}, -1)">
                                                    -
                                                </button>
                                                <span class="basket-quantity-display">${item.quantity}</span>
                                                <button class="btn btn-success btn-sm" 
                                                    onclick="changeQuantity(${item.dish_id}, 1)">
                                                    +
                                                </button>
                                            </div>
                                            <button class="btn btn-danger btn-sm"
                                                onclick="removeFromBasket(${item.basket_id})">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 basket-image-container">
                            ${item.dish_image ? `
                                <img src="${item.dish_image}" alt="${item.dish_name}" 
                                    class="basket-image rounded-end">
                            ` : `
                                <div class="basket-image-placeholder rounded-end">
                                    <span class="text-muted">No image</span>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        totalElement.innerText = total.toFixed(2);
    } catch (error) {
        console.error("Error loading basket:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack
        });
        const container = document.getElementById("basket-products");
        if (container) {
            container.innerHTML = `<p class="text-danger">Error loading basket: ${error.message}. Please try again or <a href="/login">log in</a> if you haven't already.</p>`;
        }
    }
}

//Call loadBasket when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadBasket();
});




async function removeFromBasket(basketId) {
    try {
        const res = await fetch(`/api/basket/${basketId}`, {
            method: "DELETE",
            credentials: 'include'
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
        credentials: 'include',
        body: JSON.stringify({ change })
    });

    if (!res.ok) {
        const error = await res.json();
        alert(error.error);
        return;
    }
    
    loadBasket();
}
