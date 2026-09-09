/*const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const cards = document.querySelectorAll(".card");

searchInput.addEventListener("input", function () {

    const searchValue =
        searchInput.value.trim().toLowerCase();

    cards.forEach(function (card) {

        const productName =
            card.querySelector(".card-name h3")
                .textContent
                .trim()
                .toLowerCase();

        if (productName.includes(searchValue)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

});*/
//Edit function
function editProduct(id) {

    window.location.href =
        `/edit-product?id=${encodeURIComponent(id)}`;

}
//Delete card function
async function deleteProduct(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `/api/products/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        alert("Product deleted successfully.");

        loadDashboardProducts();

    } catch (error) {

        console.error("Delete error:", error);

        alert("Failed to delete product.");

    }
}
//Create cards
function createProductCard(product, isAdmin = false) {

    // Card
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = product._id;


    // Product image
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;


    // Card info
    const info = document.createElement("div");
    info.className = "card-info";

    // Card name container
    const cardName = document.createElement("div");
    cardName.className = "card-name";


    // Category
    const category = document.createElement("p");
    category.textContent = product.category;


    // Product name
    const name = document.createElement("h3");
    name.textContent = product.name;


    // Price
    const price = document.createElement("strong");
    price.textContent = `₹${product.price}`;


    // card-name
    cardName.appendChild(category);
    cardName.appendChild(name);
    cardName.appendChild(price);


    // card-info
    info.appendChild(cardName);
    if (
        currentUser.loggedIn &&
        currentUser.role === "user"
    ){
    // Product link
    const link = document.createElement("a");
    link.href = "#";
    // Icon
    const icon = document.createElement("img");
    icon.src = "/images/icon.svg";
    icon.alt = "Add to cart";
    // link
    link.appendChild(icon);
    link.addEventListener("click", function (e) {
    e.preventDefault();

    console.log("Clicked product:", product);

    addToCart(product);
});
    info.appendChild(link);
    }
    //info.appendChild(deleteButton);

    // card
    card.appendChild(image);

    //Admin button
    if (
        currentUser.loggedIn &&
        currentUser.role === "admin"
    ) {

        const actions = document.createElement("div");

        actions.className = "product-actions";


        // Edit

        const editButton =
            document.createElement("button");

        editButton.type = "button";

        editButton.textContent = "Edit";

        editButton.className = "btn";


        editButton.addEventListener("click", function () {

            editProduct(product._id);

        });


        // Delete button

        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.textContent = "Delete";

        deleteButton.className = "btn";


        deleteButton.addEventListener("click", function () {

            deleteProduct(product._id);

        });


        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        info.appendChild(actions);
    }

    card.appendChild(info);

    return card;
}

//Create cards row
function createProductRow(products,isAdmin = false) {

    const row =
        document.createElement("div");

    row.className = "cards";

    products.forEach(function (product) {

        const card =
            createProductCard(product,isAdmin);

        row.appendChild(card);

    });

    return row;
}

//Group products by category
function groupByCategory(products) {

    const groups = {};

    products.forEach(function (product) {

        if (!groups[product.category]) {

            groups[product.category] = [];

        }

        groups[product.category].push(product);

    });

    return groups;
}

//Create section
function createCategorySection(
    category,
    products,
    isAdmin = false
) {

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

    const row =
        createProductRow(products,
            isAdmin);


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


    return section;
}

//Add everything
/*async function loadProducts() {

    try {

        const response =
            await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products =
            await response.json();


        const groups =
            groupByCategory(products);


        const container =
            document.getElementById(
                "productsContainer"
            );


        container.innerHTML = "";


        Object.entries(groups).forEach(
            function ([category, products]) {

                const section =
                    createCategorySection(
                        category,
                        products
                    );

                container.appendChild(section);

            }
        );

    } catch (error) {

        console.error(error);

    }
}

loadProducts();
*/