function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}
 //Add the product
function addToCart(product) {

    const cart = getCart();

    const existingProduct = cart.find(
        item => item._id === product._id
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(`${product.name} added to cart`);
}
// + product
function increaseQuantity(id) {

    const cart = getCart();

    const product = cart.find(item => item._id === id);

    if (!product) return;

    product.quantity += 1;

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}
function decreaseQuantity(id) {

    const cart = getCart();

    const product = cart.find(item => item._id === id);

    if (!product) return;

    if (product.quantity > 1) {

        product.quantity -= 1;

    } else {

        removeFromCart(id);
        return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}
function removeFromCart(id) {

    let cart = getCart();

    cart = cart.filter(item => item._id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}
function calculateTotal() {

    const cart = getCart();

    const total = cart.reduce(function (sum, product) {

        return sum + product.price * product.quantity;

    }, 0);

    const totalElement = document.getElementById("cartTotal");

    if (totalElement) {

        totalElement.textContent = `Total: ₹${total}`;
    }

    return total;
}
function createCartCard(product) {

    const card = document.createElement("div");

    card.className = "card";


    // Image
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;


    // Information
    const info = document.createElement("div");
    info.className = "card-info";

    const cardName = document.createElement("div");
    cardName.className = "card-name";


    // Product name
    const name = document.createElement("h3");
    name.textContent = product.name;


    // Price
    const price = document.createElement("strong");
    price.textContent = `₹${product.price}`;


    // Actions
    const actions = document.createElement("div");

    actions.className = "product-actions";


    // Decrease
    const decrease = document.createElement("button");

    decrease.type = "button";

    decrease.textContent = "−";

    decrease.className = "decrease-btn";

    decrease.addEventListener("click", function () {

        decreaseQuantity(product._id);

    });


    // Quantity
    const quantity = document.createElement("span");

    quantity.textContent = product.quantity;

    quantity.className = "quantity";


    // Increase
    const increase = document.createElement("button");

    increase.type = "button";

    increase.textContent = "+";

    increase.className = "increase-btn";

    increase.addEventListener("click", function () {

        increaseQuantity(product._id);

    });


    // Remove
    const remove = document.createElement("button");

    remove.type = "button";

    remove.textContent = "Remove";

    remove.className = "remove-btn";

    remove.addEventListener("click", function () {

        removeFromCart(product._id);

    });

    cardName.appendChild(name);
    cardName.appendChild(price);
    actions.appendChild(decrease);
    actions.appendChild(quantity);
    actions.appendChild(increase);
    actions.appendChild(remove);

    info.appendChild(cardName);
    info.appendChild(actions);
    /*
    actions.appendChild(decrease);
    actions.appendChild(quantity);
    actions.appendChild(increase);
    actions.appendChild(remove);
    */



    card.appendChild(image);
    card.appendChild(info);


    return card;
}

function displayCart() {

    const cart = getCart();

    const container = document.getElementById("cartRows");

    if (!container) 
        return;

    container.innerHTML = "";


    // Empty cart
    if (cart.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.textContent = "Your cart is empty.";

        container.appendChild(emptyMessage);

        calculateTotal();

        return;
    }

    const groups = {};


    cart.forEach(function (product) {

        const category = product.category || "Other";

        if (!groups[category]) {

            groups[category] = [];
        }

        groups[category].push(product);

    });


    // Create a row for every category
    Object.keys(groups).forEach(function (category) {

        const section = document.createElement("section");

        section.className = "product-section";

        const header =
        document.createElement("div");

    header.className = "section-header";


        // Category title
        const title = document.createElement("h2");

        title.textContent = category;


        // Carousel
        const carousel = document.createElement("div");

        carousel.className = "carousel";


        // Previous button
        const previous = document.createElement("button");

        previous.type = "button";

        previous.className = "scroll-btn prev";

        previous.textContent = "←";


        // Cards container
        const cards = document.createElement("div");

        cards.className = "cards";


        // Next button
        const next = document.createElement("button");

        next.type = "button";

        next.className = "scroll-btn next";

        next.textContent = "→";


        // Add cards
        groups[category].forEach(function (product) {

            const card = createCartCard(product);

            cards.appendChild(card);

        });


        // Horizontal scrolling
        previous.addEventListener("click", function () {

            cards.scrollBy({

                left: -350,

                behavior: "smooth"

            });

        });


        next.addEventListener("click", function () {

            cards.scrollBy({

                left: 350,

                behavior: "smooth"

            });

        });


        carousel.appendChild(previous);
        carousel.appendChild(cards);
        carousel.appendChild(next);

        header.appendChild(title);

        section.appendChild(header);
        section.appendChild(carousel);


        container.appendChild(section);

    });


    calculateTotal();
}


const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", function () {

        const cart = getCart();

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }

        window.location.href = "/checkout.html";

    });
}


displayCart();