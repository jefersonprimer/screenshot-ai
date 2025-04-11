import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Receive messages from main process
  receive: (channel: string, callback: (data: any) => void) => {
    // Whitelist channels
    const validChannels = ['ai-response', 'status-update'];
    if (validChannels.includes(channel)) {
      // Remove the event listener if it exists to prevent memory leaks
      ipcRenderer.removeAllListeners(channel);
      
      // Add a new listener
      ipcRenderer.on(channel, (_, data) => callback(data));
    }
  },
  
  // Send messages to main process
  send: (channel: string, data?: any) => {
    // Whitelist channels
    const validChannels = ['take-screenshot'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // Invoke main process methods
  invoke: async (channel: string, data?: any) => {
    // Whitelist channels
    const validChannels = ['open-external-link', 'close-notification'];
    if (validChannels.includes(channel)) {
      return await ipcRenderer.invoke(channel, data);
    }
    
    return null;
  }
});
