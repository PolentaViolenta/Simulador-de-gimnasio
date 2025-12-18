const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");

form.addEventListener("submit", event => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        message.textContent = "Completá todos los campos";
        return;
    }

    localStorage.setItem("user", username);
    window.location.href = "../index.html";
});
