let allProducts = [];
/*async function checkAuth() {

    try {

        const response =
            await fetch("/api/auth/status");

        const data =
            await response.json();

        currentUser = data;

        createHeader();

    } catch (error) {

        console.error(
            "Authentication check failed:",
            error
        );

    }
}

function updateNavigation() {

    const navbar =
        document.getElementById("navbar");

    if (!navbar) return;

    navbar.innerHTML = "";

    // Home

    const home =
        document.createElement("a");

    home.href = "/";
    home.textContent = "Home";

    navbar.appendChild(home);


    // About

    const about =
        document.createElement("a");

    about.href = "/about";
    about.textContent = "About";

    navbar.appendChild(about);


    if (!currentUser.loggedIn) {

        // =========================
        // Guest
        // =========================

        const login =
            document.createElement("a");

        login.href = "/login";
        login.textContent = "Login";

        navbar.appendChild(login);

        return;
    }


    // =========================
    // Logged User
    // =========================

    const cart =
        document.createElement("a");

    cart.href = "/cart";
    cart.textContent = "Cart";

    navbar.appendChild(cart);


    const checkout =
        document.createElement("a");

    checkout.href = "/checkout";
    checkout.textContent = "Checkout";

    navbar.appendChild(checkout);


    const orders =
        document.createElement("a");

    orders.href = "/orders.html";
    orders.textContent = "Orders";

    navbar.appendChild(orders);


    // Admin

    if (currentUser.role === "admin") {

        const dashboard =
            document.createElement("a");

        dashboard.href =
            "/dashboard.html";

        dashboard.textContent =
            "Dashboard";

        navbar.appendChild(dashboard);
    }


    // Logout

    const logout =
        document.createElement("a");

    logout.href = "/logout";
    logout.textContent = "Logout";

    navbar.appendChild(logout);
}
checkAuth();
*/

function addNavigationLink(
    parent,
    text,
    href
) {

    const link =
        document.createElement("a");

    link.href = href;

    link.textContent = text;

    parent.appendChild(link);
}

function createHeader() {
    checkAuth();
     const container = document.getElementById("headerContainer");
      if (!container)
         return;

         container.innerHTML = ""; 
    // ========================= 
    // // Header 
    // // ========================= 
  const header = document.createElement("div");
   header.className = "header"; 
  // ========================= 
  // // Logo 
  // // ========================= 
  const logo = document.createElement("img");
   logo.src = "/images/logo.jpg";
    logo.className = "photo";
     logo.alt = "Fpag Logo";
      header.appendChild(logo); 
      // ========================= // Website title // ========================= 
      const headerFont = document.createElement("div");
       headerFont.className = "header-font";
        const title1 = document.createElement("h1");
         title1.textContent = "Welcome back";
          const title2 = document.createElement("h1");
           title2.textContent = "Giad Services  website";
            headerFont.appendChild(title1);
             headerFont.appendChild(title2);
              header.appendChild(headerFont);
               // ========================= 
               // Navigation 
               // // ========================= 
               const nav = document.createElement("div");
                nav.className = "head";
                 // Home 
                addNavigationLink( nav, "Home", "/" ); 
                // ========================= 
                // // Guest 
                // // ========================= 
                if (!currentUser.loggedIn) {
                     addNavigationLink( nav, "About", "/about" );
                      addNavigationLink( nav, "Login", "/login" );
                     } 
                     // ========================= 
                     // // Normal User 
                     // // ========================= 
                    else if ( currentUser.role === "user" ) {
                          addNavigationLink( nav, "About", "/about" );
                           addNavigationLink( nav, "Cart", "/cart" );
                             addNavigationLink( nav, "Orders", "/orders" );
                             } 
                             // ========================= 
                             // // Admin 
                             // // ========================= 
                             else if ( currentUser.role === "admin" ) {
                                addNavigationLink( nav, "Cart", "/cart" );
                            addNavigationLink( nav, "Checkout", "/checkout" ); 
                                  addNavigationLink( nav, "Orders", "/orders" );
                                  addNavigationLink( nav, "dashboard", "/dashboard" );
                                 } 
                                 header.appendChild(nav);
                                  // ========================= 
                                  // // Login / Logout button 
                                  // // ========================= 
                                  if (currentUser.loggedIn) {
                                     const logoutLink = document.createElement("a");
                                      logoutLink.href = "/logout";
                                       const logoutButton = document.createElement("button");
                                        logoutButton.type = "button";
                                         logoutButton.className = "btn";
                                          logoutButton.textContent = "Logout";
                                           logoutLink.appendChild( logoutButton );
                                            header.appendChild( logoutLink );
                                         } 
                                         container.appendChild(header); 
                                        }
                                        //createHeader();
function createLandingPage() {

    const container =
        document.getElementById(
            "landingContainer"
        );

    if (!container) return;

    container.innerHTML = "";


    const landing =
        document.createElement("div");

    landing.className =
        "landing-pag";


    // =========================
    // Text
    // =========================

    const text =
        document.createElement("div");

    text.className =
        "landing-pag-text";


    const title =
        document.createElement("h1");

    title.textContent =
        "Welcome to Our Services  Store";


    const paragraph1 =
        document.createElement("p");

    paragraph1.textContent =
        "Experience comfort, style, and confidence with our distinctive collection. We offer a wide range of footwear designed to suit your lifestyle, combining durability, comfort, and modern designs at affordable prices. Walk in greater comfort, feel better, and look your best—with options ranging from comfortable everyday styles to elegant formal footwear.";


    const paragraph2 =
        document.createElement("p");

    paragraph2.textContent =
        "Our mission is to provide a diverse range of high-quality products that meet the highest standards.";


    // =========================
    // Search
    // =========================

    const searchContainer =
        document.createElement("div");

    searchContainer.className =
        "landing-pag-search";


    const searchInput =
        document.createElement("input");

    searchInput.type = "search";

    searchInput.id = "searchInput";

    searchInput.placeholder =
        "Start type...";

    searchInput.autocomplete =
        "off";


    const searchButton =
        document.createElement("button");

    searchButton.type = "button";

    searchButton.id =
        "searchButton";

    searchButton.className =
        "btn";

    searchButton.textContent =
        "SEARCH";


    searchContainer.appendChild(
        searchInput
    );

    searchContainer.appendChild(
        searchButton
    );


    text.appendChild(title);

    text.appendChild(paragraph1);

    text.appendChild(paragraph2);

    text.appendChild(
        searchContainer
    );


    // =========================
    // Photo
    // =========================

    const photoContainer =
        document.createElement("div");

    photoContainer.className =
        "landing-pag-photo";


    const photo =
        document.createElement("img");

    photo.src =
        "/images/logo.jpg";

    photo.alt =
        "Giad Shoe Store";


    photoContainer.appendChild(
        photo
    );


    // =========================
    // Complete landing
    // =========================

    landing.appendChild(text);

    landing.appendChild(
        photoContainer
    );


    container.appendChild(
        landing
    );
}

async function checkAuth() {
    try {

        const response =
            await fetch("/api/auth/status");

        const data =
            await response.json();

        currentUser = data;

        createHeader();
        createLandingPage();
        loadProducts();

    } catch (error) {

        console.error(
            "Authentication check failed:",
            error
        );

    }
}
checkAuth();

//Display search function
function displayProducts(products) {

    const container =
        document.getElementById("productsContainer");

    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {

        const message =
            document.createElement("p");

        message.textContent =
            "No products found.";

        container.appendChild(message);

        return;
    }

    products.forEach(function (product) {

        const card =
            createProductCard(
                product,
                currentUser
            );

        container.appendChild(card);

    });
}

//Search function
function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) return;

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    // إذا كان البحث فارغًا
    // اعرض جميع المنتجات

    if (!searchText) {

        displayProducts(allProducts);

        return;
    }


    const filteredProducts =
        allProducts.filter(function (product) {

            const name =
                (product.name || "")
                    .toLowerCase();

            const category =
                (product.category || "")
                    .toLowerCase();

            const description =
                (product.description || "")
                    .toLowerCase();


            return (
                name.includes(searchText) ||
                category.includes(searchText) ||
                description.includes(searchText)
            );

        });


    displayProducts(filteredProducts);
}

//Display botton
const searchButton =
    document.getElementById("searchButton");

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchProducts
    );

}

async function loadProducts() {

    try {

        const response =
            await fetch("/api/products");

        if (!response.ok) {

            throw new Error(
                "Failed to fetch products"
            );

        }

        const products =
            await response.json();

            allProducts = products;

        displayProducts(allProducts);

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
                    products,
                    false
                );

            container.appendChild(section);

        });


    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

    }
}
//loadProducts();