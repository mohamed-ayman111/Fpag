const form = document.forms["registration"];
form.addEventListener("submit", function (e){
    var username = form.username.value.trim();
                var email = form.email.value.trim();
                var password = form.password.value.trim();
                var confirmpassword = form.confirmpassword.value.trim();
                var emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                var passwordpattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
                const userpattern = /^[a-zA-Z0-9_]{3,20}$/;
                let error =""; 
               //Check input fields required.
                if(!username||!email|| !password ||!confirmpassword ){
                    error = "All field are required";
                }
                //Check username lenght.
                else if (username.length < 3){
                    error = "Username must be at least 3 characters.";
                }
                else if ( !userpattern.test(username) ){
                    error = "Invalid username";
                }
                //Check email.
                else if (!emailpattern.test(email)){
                    error = "Invalid email format.";
                }
                //Check password.
                else if (!passwordpattern.test(password)){
                    error = "Passwod must contain uppercase, lowercase ,number ,and be 8+ chars";
                }
                else if (password != confirmpassword){
                    error = "Password do not match.";
                }
                if(error){
                    e.preventDefault();
                    alert(error);
                    return false;
                }
                alert("Registartion done successfly");
                return true;
});