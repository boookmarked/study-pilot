

// ===============================
// LOGIN
// ===============================

const loginBtn = document.getElementById("loginBtn");

if(loginBtn){

    loginBtn.onclick = () => {

        const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const email = emailInput.value.trim();
const password = passwordInput.value.trim();

        const error = document.getElementById("error-message");

        const user = JSON.parse(localStorage.getItem("user"));

        emailInput.classList.remove("input-error");
passwordInput.classList.remove("input-error");

if(email===""){

    emailInput.classList.add("input-error");

}

if(password===""){

    passwordInput.classList.add("input-error");

}

if(email==="" || password===""){

    error.textContent =
    "Please enter both email and password.";

    return;

}

        if(!user){

            error.textContent =
            "No account found. Please create one first.";

            return;

        }

        if(
            email === user.email &&
            password === user.password
        ){

            sessionStorage.setItem("loggedIn","true");

            window.location.href = "pages/dashboard.html";

        }

        else{

            error.textContent =
            "Incorrect email or password.";

        }

    };

}



// ===============================
// SIGN UP
// ===============================

const signupBtn = document.getElementById("signupBtn");

if(signupBtn){

    signupBtn.onclick = () => {

        const name =
        document.getElementById("name").value.trim();

        const email =
        document.getElementById("email").value.trim();

        const password =
        document.getElementById("password").value;

        const confirm =
        document.getElementById("confirmPassword").value;

        const error =
        document.getElementById("signup-error");



        if(
            name === "" ||
            email === "" ||
            password === "" ||
            confirm === ""
        ){

            error.textContent =
            "Please fill all the fields.";

            return;

        }



        if(password !== confirm){

            error.textContent =
            "Passwords do not match.";

            return;

        }



        if(localStorage.getItem("user")){

            error.textContent =
            "An account already exists on this browser.";

            return;

        }



        const user = {

            name,
            email,
            password

        };



        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );



        alert("Account created successfully!");



        window.location.href = "index.html";

    };

}

// ===============================
// REMOVE ERRORS WHILE TYPING
// ===============================

const inputs = document.querySelectorAll("input");

inputs.forEach(input=>{

    input.addEventListener("input",()=>{

        const loginError =
        document.getElementById("error-message");

        const signupError =
        document.getElementById("signup-error");

        if(loginError){

            loginError.textContent="";

        }

        if(signupError){

            signupError.textContent="";

        }

        input.classList.remove("input-error");

    });

});