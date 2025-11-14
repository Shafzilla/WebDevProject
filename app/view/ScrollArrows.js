document.addEventListener("DOMContentLoaded", function() {
    const cuisineList = document.getElementById("cuisineList");
    const leftBtn = document.querySelector(".left-btn");
    const rightBtn = document.querySelector(".right-btn");
    const scrollAmount = 200;

    function updateArrows() {
        const maxScrollLeft = cuisineList.scrollWidth - cuisineList.clientWidth;
        const tolerance = 5;

        leftBtn.style.display = cuisineList.scrollLeft > tolerance ? "block" : "none";
        rightBtn.style.display = cuisineList.scrollLeft < maxScrollLeft - tolerance ? "block" : "none";
    }

    leftBtn.addEventListener("click", () => {
        cuisineList.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        // Update arrows immediately after scroll command
        setTimeout(updateArrows, 100); // slight delay for smooth scroll
    });

    rightBtn.addEventListener("click", () => {
        cuisineList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setTimeout(updateArrows, 100);
    });

    // Update arrows on manual scroll
    cuisineList.addEventListener("scroll", updateArrows);

    // Initial check
    updateArrows();
});
