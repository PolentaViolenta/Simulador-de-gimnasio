const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");


form.addEventListener("submit", e => {
e.preventDefault();
const username = document.getElementById("username").value.trim();
if (!username) {
message.textContent = "Ingresá un usuario";
return;
}
localStorage.setItem("user", username);
location.href = "../index.html";
});