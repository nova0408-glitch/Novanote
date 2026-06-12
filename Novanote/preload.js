const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadPage: (page) => ipcRenderer.send("load-page", page),
  saveDay: (key, data) => ipcRenderer.invoke("save-day", key, data),
  loadDay: (key) => ipcRenderer.invoke("load-day", key),
  getAllDates: () => ipcRenderer.invoke("get-all-dates"),
  deleteDay: (key) => ipcRenderer.invoke("delete-day", key),
});
