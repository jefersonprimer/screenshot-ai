"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('api', {
    // Receive messages from main process
    receive: (channel, callback) => {
        // Whitelist channels
        const validChannels = ['ai-response', 'status-update'];
        if (validChannels.includes(channel)) {
            // Remove the event listener if it exists to prevent memory leaks
            electron_1.ipcRenderer.removeAllListeners(channel);
            // Add a new listener
            electron_1.ipcRenderer.on(channel, (_, data) => callback(data));
        }
    },
    // Send messages to main process
    send: (channel, data) => {
        // Whitelist channels
        const validChannels = ['take-screenshot'];
        if (validChannels.includes(channel)) {
            electron_1.ipcRenderer.send(channel, data);
        }
    },
    // Invoke main process methods
    invoke: async (channel, data) => {
        // Whitelist channels
        const validChannels = ['open-external-link', 'close-notification'];
        if (validChannels.includes(channel)) {
            return await electron_1.ipcRenderer.invoke(channel, data);
        }
        return null;
    }
});
//# sourceMappingURL=preload.js.map