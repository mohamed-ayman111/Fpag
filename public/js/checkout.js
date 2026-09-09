/*const form =
    document.getElementById("checkoutForm");

form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();

        const cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

        if (cart.length === 0) {

            alert("Cart is empty.");

            return;
        }

        const formData =
            new FormData(form);

        const customer = {

            name:
                formData.get("name"),

            email:
                formData.get("email"),

            phone:
                formData.get("phone"),

            address:
                formData.get("address"),

            city:
                formData.get("city"),

            notes:
                formData.get("notes")

        };

        const items =
            cart.map(function (item) {

                return {

                    product: item._id,

                    quantity:
                        item.quantity

                };

            });

        try {

            const response =
                await fetch(
                    "/api/orders",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            customer,

                            items

                        })

                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message
                );

            }

            localStorage.removeItem(
                "cart"
            );

            alert(
                "Order placed successfully."
            );

            window.location.href =
                `/order-success.html?id=${data.orderId}`;

        } catch (error) {

            console.error(error);

            alert(
                "Failed to place order."
            );

        }

    }
);*/
function getCart() {

    return JSON.parse(
        localStorage.getItem("cart")
    ) || [];
}


function displayCheckoutItems() {

    const cart = getCart();

    const container =
        document.getElementById("checkoutItems");

    const totalElement =
        document.getElementById("checkoutTotal");


    container.innerHTML = "";


    if (cart.length === 0) {

        container.textContent =
            "Your cart is empty.";

        totalElement.textContent = "₹0";

        return;
    }


    let total = 0;


    cart.forEach(function (product) {

        const itemTotal =
            product.price * product.quantity;

        total += itemTotal;


        const item =
            document.createElement("div");

        item.className = "checkout-item";


        const image =
            document.createElement("img");

        image.src = product.image;

        image.alt = product.name;


        const info =
            document.createElement("div");

        info.className = "checkout-item-info";


        const name =
            document.createElement("h3");

        name.textContent = product.name;


        const quantity =
            document.createElement("p");

        quantity.textContent =
            `Quantity: ${product.quantity}`;


        const price =
            document.createElement("p");

        price.textContent =
            `₹${itemTotal}`;


        info.appendChild(name);

        info.appendChild(quantity);

        info.appendChild(price);


        item.appendChild(image);

        item.appendChild(info);


        container.appendChild(item);

    });


    totalElement.textContent =
        `₹${total}`;
}


displayCheckoutItems();

const checkoutForm =
    document.getElementById("checkoutForm");


checkoutForm.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        const cart = getCart();


        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }


        const formData =
            new FormData(checkoutForm);


        const customer = {

            name:
                formData.get("name").trim(),

            email:
                formData.get("email").trim(),

            phone:
                formData.get("phone").trim(),

            address:
                formData.get("address").trim(),

            city:
                formData.get("city").trim(),

            postalCode:
                formData.get("postalCode").trim(),

            notes:
                formData.get("notes").trim()
        };


        const items = cart.map(item => ({

            product: item._id,

            quantity: item.quantity

        }));


        const button =
            document.getElementById(
                "placeOrderBtn"
            );


        button.disabled = true;

        button.textContent =
            "Processing...";


        try {

            const response = await fetch(
                "/api/orders",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        customer,

                        items,

                        paymentMethod:
                            "COD"

                    })

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to place order."
                );

                return;
            }


            // =========================
            // Order successful
            // =========================

            localStorage.removeItem("cart");


            window.location.href =
                `/order-success.html?id=${data.orderId}`;


        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );


            alert(
                "Server error. Please try again."
            );


        } finally {

            button.disabled = false;

            button.textContent =
                "Place Order";
        }

    }
);