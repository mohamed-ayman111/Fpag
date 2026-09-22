const otpForm = document.getElementById("otpForm");
const otpInput = document.getElementById("otp");
const otpMessage = document.getElementById("otpMessage");
const resendButton = document.getElementById("resendButton");
const pater = /^\d{6}$/;

otpForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const otp = otpInput.value.trim();

    if (!pater.test(otp)) {

        otpMessage.textContent =
            "Please enter a valid 6-digit code.";

        return;
    }

    try {

        otpMessage.textContent =
            "Verifying...";

        const response = await fetch(
            "/verify-otp",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "same-origin",

                body: JSON.stringify({
                    otp
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            otpMessage.textContent =
                data.message || "OTP verification failed.";

            return;
        }

        otpMessage.textContent =
            "OTP verified successfully.";

        /*
         * الانتقال إلى صفحة تغيير كلمة المرور
         */
        window.location.href =
            "/reset-password";

    } catch (error) {

        console.error(error);

        otpMessage.textContent =
            "Unable to verify OTP. Please try again.";
    }
});


/*
 * Resend OTP
 */
resendButton.addEventListener("click", () => {

    /*
     * لأننا لا نخزن البريد في localStorage
     * نحتاج أن نعيده بطريقة آمنة.
     *
     * يمكن في النسخة الحالية إعادة المستخدم
     * إلى صفحة /respass.
     */

    window.location.href = "/respass";
});