//const form = document.forms["passtoggle"];
/*form.addEventListener("submit", function (e)
const passwordInput = form.document.getElementById("password");

const toggleButton = form.document.getElementById("togglePassword");

toggleButton.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

    } else {

        passwordInput.type = "password";

    }

});*/
const form = document.forms["passtoggle"];

const passwordInput = document.getElementById("password");
const confirmpasswordInput = document.getElementById("confirmpassword");
const toggleButton = document.getElementById("togglePassword");
const toggleButtonconfirmpassword = document.getElementById("toggleconfirmpassword");

toggleButton.addEventListener("click", function () {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    
    } });

toggleButtonconfirmpassword.addEventListener("click", function () {

    if (confirmpasswordInput.type === "password") {
        confirmpasswordInput.type = "text";
    } else {
        confirmpasswordInput.type = "password";
    }
});