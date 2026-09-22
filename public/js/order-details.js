//Read product id
const params =
    new URLSearchParams(window.location.search);

const orderId =
    params.get("id");

//Load order function
    async function loadOrder() {

    const container =
        document.getElementById("orderDetails");

    if (!orderId) {

        container.textContent =
            "Order ID is missing.";

        return;
    }

    try {

        const response =
            await fetch(
                `/api/orders/${orderId}`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load order."
            );
        }

        displayOrder(data.order);

    } catch (error) {

        console.error(
            "Order details error:",
            error
        );

        container.textContent =
            error.message;
    }
}
loadOrder();

//Create tracking section function
function createTrackingSection(
    order,
    container
) {

    const section =
        document.createElement("section");

    section.className =
        "order-section tracking-section";


    const heading =
        document.createElement("h2");

    heading.textContent =
        "Order Tracking";


    section.appendChild(
        heading
    );


    const timeline =
        document.createElement("div");

    timeline.className =
        "tracking-timeline";


    const statuses = [

        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered"

    ];


    const currentIndex =
        statuses.indexOf(
            order.status
        );


    statuses.forEach(
        function (status, index) {

            const step =
                document.createElement("div");

            step.className =
                "tracking-step";


            if (
                currentIndex >= index
            ) {

                step.classList.add(
                    "completed"
                );

            }


            if (
                order.status === status
            ) {

                step.classList.add(
                    "current"
                );

            }


            const circle =
                document.createElement("div");

            circle.className =
                "tracking-circle";

            circle.textContent =
                index + 1;


            const text =
                document.createElement("div");

            text.className =
                "tracking-text";

            text.textContent =
                status;


            step.appendChild(circle);

            step.appendChild(text);


            timeline.appendChild(step);

        }
    );


    if (
        order.status ===
        "Cancelled"
    ) {

        const cancelled =
            document.createElement(
                "div"
            );

        cancelled.className =
            "tracking-cancelled";

        cancelled.textContent =
            "Order Cancelled";

        timeline.appendChild(
            cancelled
        );

    }


    section.appendChild(
        timeline
    );


    container.appendChild(
        section
    );

}

//DisplayOrder function
function displayOrder(order) {

    const container =
        document.getElementById(
            "orderDetails"
        );

    container.innerHTML = "";


    const title =
        document.createElement("h1");

    title.textContent =
        `Order #${order._id}`;


    const date =
        document.createElement("p");

    date.textContent =
        `Placed on: ${
            new Date(
                order.createdAt
            ).toLocaleString()
        }`;


    const status =
        document.createElement("span");

    status.className =
        "order-status";

    status.textContent =
        order.status;


    const payment =
        document.createElement("p");

    payment.textContent =
        `Payment: ${order.paymentStatus}`;


    const paymentMethod =
        document.createElement("p");

    paymentMethod.textContent =
        `Payment Method: ${
            order.paymentMethod
        }`;


    container.appendChild(title);

    container.appendChild(date);

    container.appendChild(status);

    createTrackingSection(
    order,
    container
);

    container.appendChild(payment);

    container.appendChild(
        paymentMethod
    );


    createItemsSection(
        order,
        container
    );


    createCustomerSection(
        order,
        container
    );


    createTotalSection(
        order,
        container
    );
}

//createItemsSection function
function createItemsSection(
    order,
    container
) {

    const section =
        document.createElement("section");

    section.className =
        "order-section";


    const heading =
        document.createElement("h2");

    heading.textContent =
        "Products";


    section.appendChild(heading);


    order.items.forEach(function (product) {

        const item =
            document.createElement("div");

        item.className =
            "order-item";


        const image =
            document.createElement("img");

        image.src =
            product.image;

        image.alt =
            product.name;


        const info =
            document.createElement("div");
            info.className = "cart-info";


        const name =
            document.createElement("h3");

        name.textContent =
            product.name;


        const quantity =
            document.createElement("p");

        quantity.textContent =
            `Quantity: ${product.quantity}`;


        const price =
            document.createElement("strong");

        price.textContent =
            `₹${
                product.price *
                product.quantity
            }`;


        info.appendChild(name);

        info.appendChild(quantity);

        info.appendChild(price);


        item.appendChild(image);

        item.appendChild(info);


        section.appendChild(item);

    });


    container.appendChild(section);
}

//Custmer information function
function createCustomerSection(
    order,
    container
) {

    const section =
        document.createElement("section");

    section.className =
        "order-section";


    const heading =
        document.createElement("h2");

    heading.textContent =
        "Customer Information";


    section.appendChild(heading);


    const customer =
        order.customer;


    const fields = [
        ["Name", customer.name],
        ["Email", customer.email],
        ["Phone", customer.phone],
        ["Address", customer.address],
        ["City", customer.city],
        ["Postal Code", customer.postalCode]
    ];


    fields.forEach(function ([label, value]) {

        const row =
            document.createElement("p");

        row.textContent =
            `${label}: ${value}`;

        section.appendChild(row);

    });


    if (customer.notes) {

        const notes =
            document.createElement("p");

        notes.textContent =
            `Notes: ${customer.notes}`;

        section.appendChild(notes);
    }


    container.appendChild(section);
}

//Total createtotal function
function createTotalSection(
    order,
    container
) {

    const section =
        document.createElement("section");

    section.className =
        "order-total";


    const total =
        document.createElement("strong");

    total.textContent =
        `Total: ₹${order.totalAmount}`;


    section.appendChild(total);


    container.appendChild(section);
}

//