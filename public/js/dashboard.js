async function loadDashboard() {

    try {

        const response =
            await fetch(
                "/api/admin/dashboard"
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load dashboard."
            );

        }


        const stats =
            data.statistics;


        /*
        ============================
        Products
        ============================
        */

        document.getElementById(
            "totalProducts"
        ).textContent =
            stats.products.total;


        document.getElementById(
            "lowStock"
        ).textContent =
            stats.products.lowStock;


        document.getElementById(
            "outOfStock"
        ).textContent =
            stats.products.outOfStock;


        /*
        ============================
        Orders
        ============================
        */

        document.getElementById(
            "totalOrders"
        ).textContent =
            stats.orders.total;


        document.getElementById(
            "pendingOrders"
        ).textContent =
            stats.orders.pending;


        document.getElementById(
            "processingOrders"
        ).textContent =
            stats.orders.processing;


        document.getElementById(
            "shippedOrders"
        ).textContent =
            stats.orders.shipped;


        document.getElementById(
            "deliveredOrders"
        ).textContent =
            stats.orders.delivered;


        /*
        ============================
        Sales
        ============================
        */

        document.getElementById(
            "totalSales"
        ).textContent =
            `₹${stats.sales.total}`;


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        alert(
            error.message ||
            "Failed to load dashboard."
        );

    }

}


loadDashboard();