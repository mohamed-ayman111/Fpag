const form = document.forms["loginbox"];

form.addEventListener("submit", function (e) {
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (!username || !password) {
        e.preventDefault();
        alert("All fields are required.");
    }
});
        