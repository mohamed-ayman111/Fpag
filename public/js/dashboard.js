async function loadDashboardProducts() {

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
                        true
                    );


                container.appendChild(section);

            }
        );


    } catch (error) {

        console.error(
            "Error loading dashboard products:",
            error
        );

    }
}


loadDashboardProducts();