// ===============================
// LOGIN
// ===============================

const admin = "admin"
const adminpass = 'admin'

const loginBtn = document.getElementById("loginBtn");

if(loginBtn){

    loginBtn.onclick = () => {

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        const error = document.getElementById("error-message");

        const users = JSON.parse(localStorage.getItem("users")) || [];

        emailInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");

        if(email===""){
            emailInput.classList.add("input-error");
        }

        if(password===""){
            passwordInput.classList.add("input-error");
        }

// Empty fields
if(email === "" || password === ""){

    error.textContent = "Please enter both email and password.";

    return;

}

// Admin Login
if(email === admin && password === adminpass){

    sessionStorage.setItem("loggedIn","true");

    window.location.href = "pages/dashboard.html";

    return;

}

const foundUser = users.find(

    user => user.email === email

);

if(!foundUser){

    error.textContent =

    "No account exists with this email.";

    emailInput.classList.add("input-error");

    return;

}

if(foundUser.password !== password){

    error.textContent =

    "Incorrect password.";

    passwordInput.classList.add("input-error");

    return;

}

sessionStorage.setItem(

    "loggedIn",

    "true"

);

// Store current logged in user
sessionStorage.setItem(

    "currentUser",

    JSON.stringify(foundUser)

);

window.location.href="pages/dashboard.html";

    };

}


// ===============================
// SIGN UP
// ===============================

const signupBtn = document.getElementById("signupBtn");

if(signupBtn){

    signupBtn.onclick = () => {

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirmPassword").value;

        const error = document.getElementById("signup-error");

        if(
            name === "" ||
            email === "" ||
            password === "" ||
            confirm === ""
        ){
            error.textContent = "Please fill all the fields.";
            return;
        }

        if(password !== confirm){
            error.textContent = "Passwords do not match.";
            return;
        }

       let users = JSON.parse(localStorage.getItem("users")) || [];

// Check if email already exists
const existingUser = users.find(user => user.email === email);

if(existingUser){

    error.textContent =
    "An account with this email already exists.";

    return;

}

// Create new user
users.push({

    name,
    email,
    password

});

localStorage.setItem(

    "users",

    JSON.stringify(users)

);

alert("Account created successfully!");

window.location.href="index.html";

    };

}


// ===============================
// REMOVE ERRORS WHILE TYPING
// ===============================

const inputs = document.querySelectorAll("input");

inputs.forEach(input=>{

    input.addEventListener("input",()=>{

        const loginError = document.getElementById("error-message");
        const signupError = document.getElementById("signup-error");

        if(loginError){
            loginError.textContent="";
        }

        if(signupError){
            signupError.textContent="";
        }

        input.classList.remove("input-error");

    });

});