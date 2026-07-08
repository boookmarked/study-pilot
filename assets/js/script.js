const button = document.querySelector("button");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

button.addEventListener("click", function () {

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const errorMessage = document.getElementById("error-message");

    // Remove previous red borders
    emailInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");

    // Add red border to empty fields
    if (email === "") {
        emailInput.classList.add("input-error");
    }

    if (password === "") {
        passwordInput.classList.add("input-error");
    }

    // Show error message if any field is empty
    if (email === "" || password === "") {

        errorMessage.textContent = "⚠ Please enter both email and password.";
        errorMessage.style.display = "block";

        return;
    }

    // Hide error if everything is correct
    errorMessage.style.display = "none";

    // Redirect to dashboard
    window.location.href = "pages/dashboard.html";

});

const inputs = document.querySelectorAll("input");

inputs.forEach(input => {

    input.addEventListener("input", function () {

        document.getElementById("error-message").style.display = "none";

        emailInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");

    });

});