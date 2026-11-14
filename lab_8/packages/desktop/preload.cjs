// Preload (CommonJS): безпечний міст між сторінкою та головним процесом
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("cartAPI", {
    state: (query) => ipcRenderer.invoke("cart:state", query),
    add: (id) => ipcRenderer.invoke("cart:add", id),
    setQty: (id, qty) => ipcRenderer.invoke("cart:setQty", id, qty),
    remove: (id) => ipcRenderer.invoke("cart:remove", id),
    clear: () => ipcRenderer.invoke("cart:clear"),
});
