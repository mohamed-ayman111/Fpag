//Load Admin Orders
async function loadAdminOrders() {
     const container = document.getElementById( "ordersContainer" );
      try {
         const response = await fetch( "/api/admin/orders/all" );
          const data = await response.json();
           if (!response.ok) {
             throw new Error( data.message || "Failed to load orders." );
             }
              container.innerHTML = "";
               if ( !data.orders || data.orders.length === 0 ) {
                 container.innerHTML = "<p>No orders found.</p>";
                  return; 
                }
                   data.orders.forEach( function (order) {
                     const card = createOrderCard(order);
                      container.appendChild(card); 
                    });
                 } catch (error) {
                     console.error( "Admin orders error:", error );
                      container.innerHTML = `<p>${error.message}</p>`; 
                    } }

//Create Order Card
function createOrderCard(order) {
     const card = document.createElement("article");
      card.className = "admin-order-card";
       // Order ID
       const title = document.createElement("h2");
        title.textContent = `Order #${order._id}`;
         // Customer
         const customer = document.createElement("p");
          customer.textContent = `Customer: ${ order.customer.name }`;
           // Email
           const email = document.createElement("p");
            email.textContent = `Email: ${ order.customer.email }`;
             // Total
             const total = document.createElement("strong");
              total.textContent = `Total: ₹${order.totalAmount}`;
               // Status label 
        const statusLabel = document.createElement("label");
         statusLabel.textContent = "Order Status";
          // Status select
          const status = document.createElement("select");
           const statuses = [ "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled" ];
            statuses.forEach( function (value) {
                 const option = document.createElement( "option" );
                  option.value = value;
                   option.textContent = value;
                    if ( value === order.status ) {
                         option.selected = true; 
                        }
                         status.appendChild(option);
                         });
                          status.addEventListener( "change", function () {
                             updateOrderStatus( order._id, status.value );
                             });
                              // Payment label
                              const paymentLabel = document.createElement("label");
                               paymentLabel.textContent = "Payment Status";
                                // Payment select
                                const payment = document.createElement("select");
                                 const paymentStatuses = [ "Pending", "Paid", "Failed", "Refunded" ];
                                  paymentStatuses.forEach( function (value) {
                                     const option = document.createElement( "option" );
                                      option.value = value;
                                       option.textContent = value;
                                        if ( value === order.paymentStatus ) {
                                             option.selected = true;
                                             } 
                                             payment.appendChild(option);
                                             }); 
                                             payment.addEventListener( "change", function () {
                                                 updatePaymentStatus( order._id, payment.value );
                                                 }); 
                                                 // Details button
                                                 const details = document.createElement("a");
                                                  details.href = `/admin-order-details?id=${order._id}`;
                                                   details.textContent = "View Details";
                                                    details.className = "details-btn";

                                                    /*const cancelButton =
    document.createElement("button");

cancelButton.type = "button";

cancelButton.textContent =
    "Cancel Order";

cancelButton.className =
    "details-btn";
    //Cancel order function
    cancelButton.addEventListener(
        "click",
        function () {

            cancelOrder(
                order._id
            );

        }
    );

    async function cancelOrder(orderId) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this order?"
        );

    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/admin/orders/${orderId}/cancel`,
                {
                    method: "PATCH"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to cancel order."
            );

            return;
        }


        alert(
            "Order cancelled successfully."
        );


        loadOrders();


    } catch (error) {

        console.error(
            "Cancel order error:",
            error
        );


        alert(
            "Server error. Please try again."
        );

    }

}*/
                                                     // Assemble
                                                     card.appendChild(title);
                                                      card.appendChild(customer);
                                                       card.appendChild(email);
                                                        card.appendChild(total);
                                                         card.appendChild(statusLabel);
                                                          card.appendChild(status);
                                                           card.appendChild(paymentLabel);
                                                            card.appendChild(payment);
                                                             card.appendChild(details);
                                                             //card.appendChild(cancelButton);
                                                              return card;
                                                             }

//Update Order Status
async function updateOrderStatus( id, status ) {
     try {
         const response = await fetch( `/api/admin/orders/${id}/status`, {
             method: "PATCH", headers: {
             "Content-Type": "application/json" 
            }, body: JSON.stringify({
                 status: status }) 
                });
                 const data = await response.json();
                  if (!response.ok) {
                     throw new Error( data.message );
                     }
                      console.log( "Order status updated." );
                     } catch (error) {
                         console.error( "Status update error:", error );
                          alert( error.message || "Failed to update status." );
                         } 
                        }

//Update Payment Status
async function updatePaymentStatus( id, paymentStatus ) {
     try {
         const response = await fetch( `/api/admin/orders/${id}/payment-status`, {
             method: "PATCH", headers: {"Content-Type": "application/json" }
                 , body: JSON.stringify({ paymentStatus: paymentStatus }) 
                });
                 const data = await response.json();
                  if (!response.ok) {
                     throw new Error( data.message ); 
                    }
                     console.log( "Payment status updated." );
                     } catch (error) {
                         console.error( "Payment update error:", error );
                          alert( error.message || "Failed to update payment status." );
                         }}

//Start
loadAdminOrders();