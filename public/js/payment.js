const params =
    new URLSearchParams(
        window.location.search
    );


const orderId =
    params.get("id");


const message =
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


const methodElement =
    document.getElementById(
        "method"
    );


const statusElement =
    document.getElementById(
        "status"
    );


const codMessage =
    document.getElementById(
        "codMessage"
    );

    const onlinePayment = document.getElementById( "onlinePayment" );
    const payButton = document.getElementById( "payButton" );
    const paymentError = document.getElementById( "paymentError" );


if (!orderId) {

    message.textContent =
        "Order ID is missing.";

} else {

    loadPayment();

}


async function loadPayment() {

    try {

        const response =
            await fetch(
                `/api/payments/${orderId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load payment."
            );

        }


        const payment =
            data.payment;


//const order = data.order;

        orderIdElement.textContent =
            payment.orderId;


        amountElement.textContent =
            `₹${payment.amount}`;


        methodElement.textContent =
            payment.method;


        statusElement.textContent =
            payment.status;

            message.textContent =
            "Payment information loaded successfully.";


        if (
            payment.method === "COD"
        ) {

            onlinePayment.hidden = true;
            codMessage.textContent = "Payment will be collected when your order is delivered.";
             return; 
            }

            if ( payment.method === "Online" ) {
                 message.textContent = "";
                 if ( payment.status === "Paid" ) { 
                    message.textContent = "Payment has already been completed.";
                     onlinePayment.hidden = true;
                      return;
                     } 
                     if ( payment.status === "Cancelled" ) {
                         message.textContent = "This order has been cancelled.";
                        onlinePayment.hidden = true;
                         return;
                         }
                        onlinePayment.hidden = false;
                     }

    } catch (error) {

        console.error(
            "Payment error:",
            error
        );

        message.textContent =
            error.message;

    }

}

payButton.addEventListener( "click", async function () {
     paymentError.textContent = "";
      payButton.disabled = true;
       payButton.textContent = "Processing...";
        try {
const response = await fetch( "/api/payments/create", {
     method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderId }) } );
const data = await response.json();
 if (!response.ok) {
     throw new Error( data.message || "Payment could not be started." );
     } /* * At this point the server has * created/verified the payment * record. * * The next stage will redirect * to the real payment gateway. */ 
     if ( data.redirectUrl ) {
         window.location.href = data.redirectUrl;
          return;
         } message.textContent = "Payment process created successfully.";
          statusElement.textContent = data.payment.status;
         } catch (error) {
             console.error( "Payment error:", error );
              paymentError.textContent = error.message;
             } finally {
                 payButton.disabled = false;
                  payButton.textContent = "Pay Now";
                 } } );