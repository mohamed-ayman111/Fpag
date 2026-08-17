const form = document.forms["respass"];
form.addEventListener("submit", function (e) {
                const email = form.email.value.trim();
                var emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                let error = "";
                if (!email){
                    error = "Email is required.";
                } else if  (!emailpattern.test(email)){
                    error = "Invaild email.";
                }
                if(error){
                    e.preventDefault();
                    alert(error);
                }
            }); /*
            if (!email) {
        e.preventDefault();
        alert("All fields are required.");
    }
    if  (!emailpattern.test(email)){
        e.preventDefault();
        alert("Invalid email.");
    }
});*/