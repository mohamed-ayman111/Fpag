const form =
    document.getElementById("resetPasswordForm");

const password =
    document.getElementById("password");

const confirmPassword =
    document.getElementById("confirmPassword");

const message =
    document.getElementById("resetMessage");


function validatePassword(value) {

    return {
        length: value.length >= 8,
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        number: /\d/.test(value)
    };
}


function updatePasswordRules() {

    const result =
        validatePassword(password.value);

    document.getElementById("lengthRule")
        .classList.toggle(
            "valid",
            result.length
        );

    document.getElementById("upperRule")
        .classList.toggle(
            "valid",
            result.upper
        );

    document.getElementById("lowerRule")
        .classList.toggle(
            "valid",
            result.lower
        );

    document.getElementById("numberRule")
        .classList.toggle(
            "valid",
            result.number
        );
}


password.addEventListener(
    "input",
    updatePasswordRules
);


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const newPassword =
            password.value;

        const confirmation =
            confirmPassword.value;

        const validation =
            validatePassword(newPassword);


        if (
            !validation.length ||
            !validation.upper ||
            !validation.lower ||
            !validation.number
        ) {

            message.textContent =
                "Password does not meet the requirements.";

            return;
        }


        if (newPassword !== confirmation) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        try {

            message.textContent =
                "Updating password...";


            const response =
                await fetch(
                    "/reset-password",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials:
                            "same-origin",

                        body: JSON.stringify({
                            password:
                                newPassword,
                            confirmPassword:
                                confirmation
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Unable to reset password.";

                return;
            }


            message.textContent =
                "Password changed successfully.";

            /*
             * بعد تغيير كلمة المرور
             * لا نسجل الدخول تلقائياً.
             */
            setTimeout(() => {

                window.location.href =
                    "/login";

            }, 1500);


        } catch (error) {

            console.error(error);

            message.textContent =
                "Server error. Please try again.";
        }
    }
);