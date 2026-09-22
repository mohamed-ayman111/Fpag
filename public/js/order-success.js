const params =
            new URLSearchParams(
                window.location.search
            );


        const orderId =
            params.get("id");

        const paymentLink =
    document.getElementById(
        "paymentLink");    


        if (orderId) {

            document.getElementById(
                "orderId"
            ).textContent =
                `Order ID: ${orderId}`;

            paymentLink.href =
        `/payment?id=${orderId}`;    

        }