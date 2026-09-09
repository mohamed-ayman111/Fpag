function getCart() {

    return JSON.parse(
        localStorage.getItem("cart")
    ) || [];

}

// - product
function decreaseQuantity(id) {

    const cart = getCart();

    const product =
        cart.find(item => item._id === id);

    if (!product) return;

    if (product.quantity > 1) {

        product.quantity -= 1;

    } else {

        removeFromCart(id);
        return;
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}
//Delete product
function removeFromCart(id) {

    let cart = getCart();

    cart = cart.filter(
        item => item._id !== id
    );

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}
//Calculate products
function calculateTotal() {

    const cart = getCart();

    const total = cart.reduce(
        function (sum, product) {

            return sum +
                product.price * product.quantity;

        },
        0
    );

    document.getElementById(
        "cartTotal"
    ).textContent =
        `Total: ₹${total}`;
}

displayCart();

function displayCart() {

    const cart = getCart();

    const container =
        document.getElementById("cartContainer");

    container.innerHTML = "";

    if (cart.length === 0) {

        container.textContent =
            "Your cart is empty.";

        return;
    }

    cart.forEach(function (product) {

        const item =
            document.createElement("div");

        item.className = "card";

        const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;

    const info = document.createElement("div");
    info.className = "card-info";

    const cardName = document.createElement("div");
    cardName.className = "card-name";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("strong");
    price.textContent = `₹${product.price}`;

    cardName.appendChild(name);
    cardName.appendChild(price);


    const actions = document.createElement("div");

        actions.className = "product-actions";
        
        const decrease =
            document.createElement("button");

        decrease.type = "button";

        decrease.textContent = "-";

        decrease.className = "decrease-btn";


        decrease.addEventListener("click", function () {

            decreaseQuantity(product._id);

        });

        const quantity =
            document.createElement("span");
            quantity.textContent = product.quantity;

            const increase =
            document.createElement("button");

        increase.type = "button";

        increase.textContent = "+";

        increase.className = "decrease-btn";


        increase.addEventListener("click", function () {

            increaseQuantity(product._id);

        });

        const remove =
            document.createElement("button");

        remove.type = "button";

        remove.textContent = "Remove";

        remove.className = "decrease-btn";


        remove.addEventListener("click", function () {

            removeFromCart(product._id);

        });

        actions.appendChild(decrease);
        actions.appendChild(quantity);
        actions.appendChild(increase);
        actions.appendChild(remove);

        info.appendChild(cardName);
        info.appendChild(actions);

        item.appendChild(image);
        item.appendChild(info);

        /*const row =
        document.createElement("div");

    row.className = "cards";
    row.appendChild(item);

    const groups = {};
    if (!groups[product.category]) {

            groups[product.category] = [];

        }

        groups[product.category].push(product);

        const section =
        document.createElement("section");

    section.className = "product-section";


    const header =
        document.createElement("div");

    header.className = "section-header";


    const title =
        document.createElement("h3");

    title.textContent = category;


    const buttons =
        document.createElement("div");

    buttons.className = "carousel";


    const prev =
        document.createElement("button");

    prev.type = "button";

    prev.className = "scroll-btn prev";

    prev.textContent = "←";


    const next =
        document.createElement("button");

    next.type = "button";

    next.className = "scroll-btn next";

    next.textContent = "→";

    buttons.appendChild(prev);
    buttons.appendChild(row);
    buttons.appendChild(next);

    header.appendChild(title);


    section.appendChild(header);
    section.appendChild(buttons);


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
        *//*item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>₹${product.price}</p>

            <button onclick="decreaseQuantity('${product._id}')">
                -
            </button>

            <span>${product.quantity}</span>

            <button onclick="increaseQuantity('${product._id}')">
                +
            </button>

            <button onclick="removeFromCart('${product._id}')">
                Remove
            </button>
        `;*/

        container.appendChild(item);

    });

    calculateTotal();
}