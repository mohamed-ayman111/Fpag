// ========================================
// Read payment ID from URL
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const paymentId =
    params.get("id");


// ========================================
// Elements
// ========================================

const paymentMessage =
    document.getElementById(
        "paymentMessage"
    );


const orderIdElement =
    document.getElementById(
        "orderId"
    );


const amountElement =
    document.getElementById(
        "amount"
    );


const statusElement =
    document.getElementById(
        "status"
    );


const paymentError =
    document.getElementById(
        "paymentError"
    );


const payButton =
    document.getElementById(
        "payButton"
    );


const failButton =
    document.getElementById(
        "failButton"
    );


const cancelButton =
    document.getElementById(
        "cancelButton"
    );


// ========================================
// Payment data
// ========================================

let payment = null;


// ========================================
// Check payment ID
// ========================================

if (!paymentId) {

    paymentMessage.textContent =
        "Payment ID is missing.";

    payButton.disabled = true;

    failButton.disabled = true;

    cancelButton.disabled = true;

} else {

    loadPayment();

}


// ========================================
// Load payment
// ========================================

async function loadPayment() {

    try {

        paymentMessage.textContent =
            "Loading payment information...";


        const response =
            await fetch(
                `/api/payments/test/${paymentId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load payment."
            );

        }


        payment =
            data.payment;


        // ==============================
        // Display information
        // ==============================

        orderIdElement.textContent =
            payment.orderId;


        amountElement.textContent =
            `₹${payment.amount}`;


        statusElement.textContent =
            payment.status;


        payButton.textContent =
            `Pay ₹${payment.amount}`;


        paymentMessage.textContent =
            "Payment information loaded.";


        // ==============================
        // Payment already completed
        // ==============================

        if (
            payment.status ===
            "Paid"
        ) {

            paymentMessage.textContent =
                "Payment has already been completed.";

            disableButtons();

            return;
        }


        // ==============================
        // Failed payment
        // ==============================

        if (
            payment.status ===
            "Failed"
        ) {

            paymentMessage.textContent =
                "This payment has failed.";

            disableButtons();

            return;
        }


        // ==============================
        // Cancelled payment
        // ==============================

        if (
            payment.status ===
            "Cancelled"
        ) {

            paymentMessage.textContent =
                "This payment has been cancelled.";

            disableButtons();

            return;
        }


    } catch (error) {

        console.error(
            "Load payment error:",
            error
        );


        paymentMessage.textContent =
            error.message;

        disableButtons();

    }

}


// ========================================
// PAY BUTTON
// ========================================

payButton.addEventListener(
    "click",
    async function () {

        if (!paymentId) {
            return;
        }


        paymentError.textContent =
            "";


        setProcessing(
            "Processing payment..."
        );


        try {

            const response =
                await fetch(
                    "/api/payments/test/verify",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                paymentId:
                                    paymentId

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Payment verification failed."
                );

            }


            // ==========================
            // Payment successful
            // ==========================

            statusElement.textContent =
                data.payment.status;


            paymentMessage.textContent =
                "Payment completed successfully.";


            /*
             * Give the server a moment
             * to finish updating the order.
             */

            setTimeout(
                function () {

                    window.location.href =
                        `/payment-success?id=${data.payment.orderId}`;

                },
                700
            );


        } catch (error) {

            console.error(
                "Payment verification error:",
                error
            );


            paymentError.textContent =
                error.message;


            restoreButtons();

        }

    }
);


// ========================================
// FAIL BUTTON
// ========================================

failButton.addEventListener(
    "click",
    async function () {

        if (!paymentId) {
            return;
        }


        paymentError.textContent =
            "";


        setProcessing(
            "Processing failed payment..."
        );


        try {

            const response =
                await fetch(
                    "/api/payments/test/fail",
                    {

                        method: "PATCH",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                paymentId:
                                    paymentId

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update payment."
                );

            }


            statusElement.textContent =
                data.payment.status;


            paymentMessage.textContent =
                "Payment failed.";


            disableButtons();

            window.location.href =
            `/payment-failed?id=${paymentId}`;

        } catch (error) {

            console.error(
                "Payment failure error:",
                error
            );


            paymentError.textContent =
                error.message;


            restoreButtons();

        }

    }
);


// ========================================
// CANCEL BUTTON
// ========================================

cancelButton.addEventListener(
    "click",
    async function () {

        if (!paymentId) {
            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to cancel this payment?"
            );


        if (!confirmed) {
            return;
        }


        paymentError.textContent =
            "";


        setProcessing(
            "Cancelling payment..."
        );


        try {

            const response =
                await fetch(
                    "/api/payments/test/cancel",
                    {

                        method: "PATCH",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                paymentId:
                                    paymentId

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to cancel payment."
                );

            }


            statusElement.textContent =
                data.payment.status;


            paymentMessage.textContent =
                "Payment cancelled.";


            disableButtons();

            window.location.href =
            `/payment-cancelled?id=${paymentId}`;

        } catch (error) {

            console.error(
                "Payment cancellation error:",
                error
            );


            paymentError.textContent =
                error.message;


            restoreButtons();

        }

    }
);


// ========================================
// Disable buttons
// ========================================

function disableButtons() {

    payButton.disabled =
        true;

    failButton.disabled =
        true;

    cancelButton.disabled =
        true;

}


// ========================================
// Processing state
// ========================================

function setProcessing(message) {

    paymentMessage.textContent =
        message;


    payButton.disabled =
        true;

    failButton.disabled =
        true;

    cancelButton.disabled =
        true;

}


// ========================================
// Restore buttons
// ========================================

function restoreButtons() {

    payButton.disabled =
        false;

    failButton.disabled =
        false;

    cancelButton.disabled =
        false;

}