const carousels =
    document.querySelectorAll(".carousel");

carousels.forEach(function (carousel) {

    const cards =
        carousel.querySelector(".cards");

    const prev =
        carousel.querySelector(".prev");

    const next =
        carousel.querySelector(".next");


    next.addEventListener("click", function () {

        cards.scrollBy({
            left: 400,
            behavior: "smooth"
        });

    });


    prev.addEventListener("click", function () {

        cards.scrollBy({
            left: -400,
            behavior: "smooth"
        });

    });

});