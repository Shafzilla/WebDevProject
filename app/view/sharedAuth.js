// Shared authentication and navigation functions for all pages

async function checkLoginStatus() {
    const greetingElement = document.getElementById('user-greeting');
    const logoutButton = document.getElementById('logout-button');
    const navbarLoginLink = document.getElementById('navbar-login-link');
    const navbarSignupLink = document.getElementById('navbar-signup-link');
    
    if (!greetingElement) {
        // Page doesn't have auth elements, skip
        return false;
    }

    try {
        const res = await fetch('/api/user');

        if (res.status === 200) {
            const userData = await res.json();

            // Show greeting message when logged in
            if (greetingElement) {
                greetingElement.innerHTML = `
                    <p class="h4 fw-bold text-success">
                    Hello, ${userData.username}!
                    </p>
                `;
            }

            if (logoutButton) {
                logoutButton.style.display = 'inline-block';
            }
            
            // Hide navbar login/signup links when logged in
            if (navbarLoginLink) {
                navbarLoginLink.style.display = 'none';
            }
            if (navbarSignupLink) {
                navbarSignupLink.style.display = 'none';
            }
            
            return true;
        } else {
            // Clear greeting area when not logged in 
            if (greetingElement) {
                greetingElement.innerHTML = '';
            }

            if (logoutButton) {
                logoutButton.style.display = 'none';
            }
            
            // Show navbar login/signup links when not logged in
            if (navbarLoginLink) {
                navbarLoginLink.style.display = '';
            }
            if (navbarSignupLink) {
                navbarSignupLink.style.display = '';
            }
            
            return false;
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        // On error, assume not logged in
        if (greetingElement) {
            greetingElement.innerHTML = '';
        }
        if (logoutButton) {
            logoutButton.style.display = 'none';
        }
        if (navbarLoginLink) {
            navbarLoginLink.style.display = '';
        }
        if (navbarSignupLink) {
            navbarSignupLink.style.display = '';
        }
        return false;
    }
}

async function isUserLoggedIn() {
    try {
        const res = await fetch('/api/user');
        return res.status === 200;
    } catch (e) {
        return false;
    }
}

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
            window.location.href = '/';
        } else {
            console.error('logout failed');
            alert('logout failed');
        }
    } catch (error) {
        console.error('network error', error);
        alert('network error');
    }
}

async function updateBasketLink() {
    const basketLinks = document.querySelectorAll('.shopping-cart a, .shopping-cart-menu a');
    
    const isLoggedIn = await isUserLoggedIn();

    basketLinks.forEach(basketLink => {
        if (isLoggedIn) {
            basketLink.href = '/basket';
        } else {
            basketLink.href = '/login';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // Check login status and update UI
    checkLoginStatus();
    
    // Update basket links based on login status
    updateBasketLink();
});

