const form = document.forms["respass"];

const message = document.getElementById("respassMessage");


form.addEventListener("submit", async function (e) {

    e.preventDefault();


    /*
     * الحصول على البريد
     */
    const email = form.email.value.trim();


    /*
     * Email validation
     */
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    let error = "";


    if (!email) {

        error = "Email is required.";

    } else if (!emailPattern.test(email)) {

        error = "Invalid email.";

    }


    /*
     * عرض خطأ التحقق المحلي
     */
    if (error) {

        message.textContent = error;

        return;
    }


    try {

        /*
         * إظهار حالة الإرسال
         */
        message.textContent =
            "Sending verification code...";


        /*
         * إرسال البريد إلى السيرفر
         *
         * POST /respass
         */
        const response = await fetch(
            "/respass",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "same-origin",

                body: JSON.stringify({
                    email: email
                })
            }
        );


        /*
         * قراءة JSON القادم من السيرفر
         */
        const data = await response.json();


        /*
         * إذا كان السيرفر أعاد خطأ
         */
        if (!response.ok) {

            message.textContent =
                data.message ||
                "Unable to send verification code.";

            return;
        }


        /*
         * السيرفر قبل الطلب
         */
        message.textContent =
            data.message ||
            "Verification code sent.";


        /*
         * الانتقال إلى صفحة OTP
         */
        window.location.href =
            "/verify-otp";


    } catch (error) {

        console.error(
            "Password reset request error:",
            error
        );


        message.textContent =
            "Unable to connect to the server. Please try again.";
    }

});