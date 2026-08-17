const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const cards = document.querySelectorAll(".card");

searchInput.addEventListener("input", function () {

    const searchValue =
        searchInput.value.trim().toLowerCase();

    cards.forEach(function (card) {

        const productName =
            card.querySelector(".card-name h3")
                .textContent
                .trim()
                .toLowerCase();

        if (productName.includes(searchValue)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

});