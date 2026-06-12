const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, ipcMain } = require("electron");

let win;

const userDataPath = app.getPath("userData");
const dataDir = path.join(userDataPath, "novanote-data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function getDataFilePath(key) {
  return path.join(dataDir, `${key}.json`);
}

function saveDayData(key, data) {
  fs.writeFileSync(getDataFilePath(key), JSON.stringify(data, null, 2));
}

function loadDayData(key) {
  const filePath = getDataFilePath(key);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      console.error("Error loading data:", e);
      return null;
    }
  }
  return null;
}

function getAllDates() {
  try {
    const files = fs.readdirSync(dataDir);
    return files
      .filter(f => f.endsWith(".json"))
      .map(f => f.replace(".json", ""))
      .sort((a, b) => b.localeCompare(a));
  } catch (e) {
    return [];
  }
}

ipcMain.handle("save-day", (event, key, data) => {
  try {
    saveDayData(key, data);
    return true;
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
});

ipcMain.handle("load-day", (event, key) => {
  return loadDayData(key);
});

ipcMain.handle("get-all-dates", () => {
  return getAllDates();
});

ipcMain.handle("delete-day", (event, key) => {
  const filePath = getDataFilePath(key);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
});

function createWindow() {
  win = new BrowserWindow({
    width: 640,
    height: 760,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.removeMenu();
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on("load-page", (event, page) => {
  win.loadFile(page);
});
