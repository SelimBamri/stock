const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    icon: "./pharmacy.png",
  });
  mainWindow.maximize();
  mainWindow.loadFile("index.html");
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const db = new sqlite3.Database(path.join(__dirname, "users.db")); // Use path.join for consistency

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )`);
});

ipcMain.on("login", (event, credentials) => {
  const { username, password } = credentials;
  db.get(
    `SELECT * FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, row) => {
      if (err) {
        event.reply("login-result", {
          success: false,
          message: "Une erreur est survenue.",
        });
      } else if (row) {
        event.reply("login-result", { success: true });
      } else {
        event.reply("login-result", {
          success: false,
          message: "Données invalides",
        });
      }
    }
  );
});

ipcMain.on("editAccount", (event, credentials) => {
  const { username, password } = credentials;
  const sql = `UPDATE users SET username = ?, password = ? WHERE id = 1`;
  const params = [username, password];
  db.run(sql, params, function (err) {
    if (err) {
      console.error("Une erreur est survenue:", err.message);
      event.reply("edit-account-result", {
        success: false,
        message: "Failed to update user.",
      });
    } else {
      console.log(
        `Utilisateur modifié avec succès. Changement: ${this.changes}`
      );
      event.reply("edit-account-result", { success: true });
    }
  });
});
