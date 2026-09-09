const params =
    new URLSearchParams(
        window.location.search
    );


const productId =
    params.get("id");
console.log("Product ID:", productId);
if (!productId) {
    alert("Product ID is missing.");
}
    async function loadProduct() {

    try {

        const response =
            await fetch(
                `/api/products/${productId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load product"
            );

        }


        const product =
            await response.json();


        document.getElementById("name")
            .value = product.name;


        document.getElementById("category")
            .value = product.category;


        document.getElementById("description")
            .value = product.description;


        document.getElementById("price")
            .value = product.price;


        document.getElementById("image")
            .value = product.image;


        document.getElementById("stock")
            .value = product.stock;


    } catch (error) {

        console.error(error);

        alert(
            "Failed to load product."
        );

    }
}
loadProduct();

const form =
    document.getElementById(
        "editProductForm"
    );

    form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        const name =
            document.getElementById(
                "name"
            ).value.trim();


        const category =
            document.getElementById(
                "category"
            ).value.trim();


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        const price =
            document.getElementById(
                "price"
            ).value.trim();


        const image =
            document.getElementById(
                "image"
            ).value.trim();


        const stock =
            document.getElementById(
                "stock"
            ).value.trim();


        if (
            !name ||
            !category ||
            !description ||
            !price ||
            !image ||
            !stock
        ) {

            alert(
                "All fields are required."
            );

            return;
        }


        const updatedProduct = {

            name,
            category,
            description,
            price,
            image,
            stock

        };


        try {

            const response =
                await fetch(
                    `/api/products/${productId}`,
                    {

                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedProduct
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update product"
                );

            }


            alert(
                "Product updated successfully."
            );


            window.location.href =
                "/dashboard";


        } catch (error) {

            console.error(
                "Update error:",
                error
            );


            alert(
                "Failed to update product."
            );

        }

    }
);