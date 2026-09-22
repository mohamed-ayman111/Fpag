async function loadOrders() {

    const container =
        document.getElementById("ordersContainer");

    try {

        const response =
            await fetch("/api/orders");

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Failed to load orders."
            );
        }

        container.innerHTML = "";

        if (data.orders.length === 0) {

            const message =
                document.createElement("p");

            message.textContent =
                "You have no orders yet.";

            container.appendChild(message);

            return;
        }

        data.orders.forEach(function (order) {

            const card =
                createOrderCard(order);

            container.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Orders error:",
            error
        );

        container.textContent =
            "Unable to load orders.";
    }
}

function createOrderCard(order) {

    const card =
        document.createElement("div");

    card.className = "order-card";


    const orderId =
        document.createElement("h3");

    orderId.textContent =
        `Order #${order._id}`;


    const date =
        document.createElement("p");

    date.textContent =
        `Date: ${new Date(order.createdAt).toLocaleDateString()}`;


    const items =
        document.createElement("p");

    items.textContent =
        `Items: ${order.items.length}`;


    const total =
        document.createElement("strong");

    total.textContent =
        `Total: ₹${order.totalAmount}`;


    const status =
        document.createElement("span");

    status.className =
        "order-status";

    status.textContent =
        order.status;


    const button =
        document.createElement("button");

    button.type = "button";

    button.textContent =
        "View Order";


        const cancelButton =
    document.createElement("button");

cancelButton.type = "button";

cancelButton.textContent =
    "Cancel Order";

cancelButton.className =
    "cancel-order-btn";


    button.addEventListener(
        "click",
        function () {

            window.location.href =
                `/order-details?id=${order._id}`;

        }
    );


    card.appendChild(orderId);
    card.appendChild(date);
    card.appendChild(items);
    card.appendChild(total);
    card.appendChild(status);
    card.appendChild(button);
    if (
    order.status === "Pending" ||
    order.status === "Confirmed"
) {

    cancelButton.addEventListener(
        "click",
        function () {

            cancelOrder(
                order._id
            );

        }
    );

    card.appendChild(
        cancelButton
    );

}

    return card;
}


loadOrders();

//Cancel order function
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
                `/api/orders/${orderId}/cancel`,
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

}