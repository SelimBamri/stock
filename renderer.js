const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  window.electron.login({ username, password });
});

window.electron.onLoginResult((result) => {
  if (result.success) {
    window.location = "home.html";
  } else {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("wrong-input").innerText =
      "Les données sont érronées";
  }
});
