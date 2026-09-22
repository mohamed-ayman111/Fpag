const toggleButtons =
    document.querySelectorAll(
        ".toggle-password"
    );


toggleButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                /*
                 * Get target input ID
                 */
                const targetId =
                    button.dataset.target;


                /*
                 * Find input
                 */
                const input =
                    document.getElementById(
                        targetId
                    );


                /*
                 * Show password
                 */
                if (
                    input.type === "password"
                ) {

                    input.type = "text";

                    button.textContent =
                        "👁️‍🗨️";

                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );


                /*
                 * Hide password
                 */
                } else {

                    input.type = "password";

                    button.textContent =
                        "👁";

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }
);