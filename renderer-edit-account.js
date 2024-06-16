const editAccountForm = document.getElementById("edit-account-form");

editAccountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password1").value;
  const confirmPassword = document.getElementById("password2").value;
  if (password != confirmPassword) {
    document.getElementById("wrong-input").innerText =
      "Les mots de passe ne correspondent pas.";
  } else {
    window.electron.editAccount({ username, password });
  }
});

window.electron.onEditAccountResult((result) => {
  if (result.success) {
    window.location = "home.html";
  } else {
    document.getElementById("username").value = "";
    document.getElementById("password1").value = "";
    document.getElementById("password2").value = "";
    document.getElementById("wrong-input").innerText =
      "Une erreur est survenue, essayez ultérieurement";
  }
});
