const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  login: (credentials) => ipcRenderer.send("login", credentials),
  onLoginResult: (callback) =>
    ipcRenderer.on("login-result", (event, result) => callback(result)),
  editAccount: (credentials) => ipcRenderer.send("editAccount", credentials),
  onEditAccountResult: (callback) =>
    ipcRenderer.on("edit-account-result", (event, result) => callback(result)),
});
