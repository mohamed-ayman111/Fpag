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


const retryPayment =
    document.getElementById(
        "retryPayment"
    );


if (!orderId) {

    orderIdElement.textContent =
        "Missing";

    retryPayment.style.display =
        "none";

} else {

    orderIdElement.textContent =
        orderId;

    retryPayment.href =
        `/payment-test?id=${orderId}`;
}