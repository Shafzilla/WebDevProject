
// getting data from sign up page and posting it on API endpoint
document.getElementById("signup-form").addEventListener("submit", async function(e) {

    e.preventDefault();

    // getting data from fields
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageArea = document.getElementById("message-area");
    const signUpButton = document.getElementById("signup-button");

    // posting data on API endpoint
    const response = await fetch("/api/signup", {

        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, email, password})
    })

    await response.json();

    window.location.href = "/";


})