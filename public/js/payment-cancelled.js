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


const returnPayment =
    document.getElementById(
        "returnPayment"
    );


if (!orderId) {

    orderIdElement.textContent =
        "Missing";

    returnPayment.style.display =
        "none";

} else {

    orderIdElement.textContent =
        orderId;

    returnPayment.href =
        `/payment-test?id=${orderId}`;
}