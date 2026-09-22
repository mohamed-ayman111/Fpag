const params =
    new URLSearchParams(
        window.location.search
    );


const orderId =
    params.get("id");


const orderIdElement =
    document.getElementById(
        "orderId"
    );


if (orderId) {

    orderIdElement.textContent =
        orderId;

} else {

    orderIdElement.textContent =
        "Unavailable";

}