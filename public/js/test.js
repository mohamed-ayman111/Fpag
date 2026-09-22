const next = document.getElementById("next");
const prev = document.getElementById("prev");

next.addEventListener("click", function () {

        row.scrollBy({
            left: 400,
            behavior: "smooth"
        });

    });

    prev.addEventListener("click", function () {

        row.scrollBy({
            left: -400,
            behavior: "smooth"
        });

    });